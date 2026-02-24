import { Request, Response } from "express";
import Order from "../models/Order";
import Cart from "../models/Cart";
import Food from "../models/Food";


// POST /api/orders — Place order from cart
export const placeOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      res.status(400).json({
        success: false,
        message: "user_id is required.",
      });
      return;
    }

    // Fetch the user's cart
    const cart = await Cart.findOne({ user_id });

    if (!cart || cart.items.length === 0) {
      res.status(404).json({
        success: false,
        message: "Your cart is empty. Add items before placing an order.",
      });
      return;
    }

    // Re-validate every item in the cart
    const unavailableItems: string[] = [];

    for (const item of cart.items) {
      const food = await Food.findById(item.food_id);

      if (!food || !food.is_available) {
        unavailableItems.push(item.name);
      }
    }

    // If any items are unavailable, reject the entire order
    if (unavailableItems.length > 0) {
      res.status(400).json({
        success: false,
        message: `The following items are no longer available: ${unavailableItems.join(", ")}. Please update your cart.`,
        unavailable_items: unavailableItems,
      });
      return;
    }

    // Calculate total price server-side
    const total_price = cart.items.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    // Create the order using a snapshot of the cart
    const order = await Order.create({
      user_id,
      items: cart.items.map((item) => ({
        food_id: item.food_id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      })),
      total_price,
      status: "Pending",
    });

    // Clear the cart after successful order placement
    cart.items = [];
    cart.cart_total = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      message:
        "Order placed successfully! Your food is being processed.",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Could not place order.",
    });
  }
};

// GET /api/orders/:id — Get single order
export const getOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate(
      "user_id",
      "name email phone"
    );

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Could not retrieve order.",
    });
  }
};

// GET /api/orders/user/:userId — Get all orders by a user
export const getUserOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user_id: userId }).sort({
      createdAt: -1, 
    });

    if (orders.length === 0) {
      res.status(404).json({
        success: false,
        message: "No orders found for this user.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      total_orders: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Could not retrieve orders.",
    });
  }
};

// GET /api/orders — Get ALL orders (Admin)
export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Allow filtering by status via query param
    const { status } = req.query;

    const filter = status ? { status } : {};

    const orders = await Order.find(filter)
      .populate("user_id", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total_orders: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Could not retrieve orders.",
    });
  }
};


// PATCH /api/orders/:id/status — Update order status (Admin)
export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Out for Delivery",
      "Completed",
      "Cancelled",
    ];

    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
      return;
    }

    const order = await Order.findById(id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found.",
      });
      return;
    }

    // Cannot update a cancelled or completed order
    if (order.status === "Cancelled") {
      res.status(400).json({
        success: false,
        message: "Cannot update a cancelled order.",
      });
      return;
    }

    if (order.status === "Completed") {
      res.status(400).json({
        success: false,
        message: "Cannot update a completed order.",
      });
      return;
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}.`,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Could not update order status.",
    });
  }
};


// PATCH /api/orders/:id/cancel — Cancel order
export const cancelOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { user_id, cancelled_by, cancellation_reason } = req.body;

    if (!cancelled_by || !["Customer", "Admin"].includes(cancelled_by)) {
      res.status(400).json({
        success: false,
        message: "cancelled_by must be either 'Customer' or 'Admin'.",
      });
      return;
    }

    const order = await Order.findById(id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found.",
      });
      return;
    }

    // Already cancelled
    if (order.status === "Cancelled") {
      res.status(400).json({
        success: false,
        message: "This order has already been cancelled.",
      });
      return;
    }

    // Already completed
    if (order.status === "Completed") {
      res.status(400).json({
        success: false,
        message: "Cannot cancel a completed order.",
      });
      return;
    }

    // Customer can only cancel if Pending or Confirmed
    if (
      cancelled_by === "Customer" &&
      !["Pending", "Confirmed"].includes(order.status)
    ) {
      res.status(400).json({
        success: false,
        message: `You can only cancel an order that is Pending or Confirmed. Your order is currently ${order.status}.`,
      });
      return;
    }

    // Verify order belongs to the customer
    if (
      cancelled_by === "Customer" &&
      order.user_id.toString() !== user_id
    ) {
      res.status(403).json({
        success: false,
        message: "You are not authorised to cancel this order.",
      });
      return;
    }

    order.status = "Cancelled";
    order.cancelled_by = cancelled_by;
    order.cancellation_reason = cancellation_reason || "No reason provided";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Could not cancel order.",
    });
  }
};