import { Request, Response } from "express";
import Cart from "../models/Cart";
import Food from "../models/Food";
import mongoose from "mongoose";

// POST /api/cart - create a new cart
export const addToCart = async (
    req: Request,
    res: Response
): Promise<void> => {
   try {
    const {user_id, food_id, quantity} = req.body;

    if (!user_id || !food_id || !quantity) {
        res.status(400).json({
            success: false,
            message: "user_id, food_id, and quantity are required"});
        return;
    }

    // validate quantity
    if (quantity < 1) {
        res.status(400).json({
            success: false,
            message: "Quantity must be at least 1"});
        return;
    }

    const food = await Food.findById(food_id);
    if(!food){
        res.status(404).json({
            success: false,
            message: "Food not found"});
        return;
    }

    if(!food.is_available){
        res.status(400).json({
            success: false,
            message: `${food.name} is not currently available`});
        return;
    }

    // find or create cart
    let cart = await Cart.findOne({user_id});
    if (!cart) {
        cart = new Cart({user_id, items: []});
    }

    // check if food is already in cart
    const existingItemIndex = cart.items.findIndex((item) => item.food_id.toString() === food_id.toString());

    if (existingItemIndex > -1){
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].subtotal = cart.items[existingItemIndex].quantity * food.price;
    } else {
        // add new item to cart
        cart.items.push({
            food_id: new mongoose.Types.ObjectId(food_id),
            name: food.name,
            quantity,
            price: food.price,
            subtotal: food.price * quantity,
        });
    }

    // save cart
    await cart.save();
    res.status(200).json({
        success: true,
        message: `${food.name} added to cart successfully.`,
        cart
    });
   } catch (error) {
    res.status(500).json({
        success: false,
        message: "Server error. Could not add food to cart."});
   } 
}

// GET /api/cart/:user_id - view user's cart
export const getCart = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {userId} = req.params;

        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required"});
            return;
        }

        const cart = await Cart.findOne({user_id: userId}).populate("user_id", "name email");
        if (!cart || cart.items.length === 0) {
            res.status(404).json({
                success: false,
                message: "Your cart is empty"});
            return;
        }

        res.status(200).json({
            success: true,
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error. Could not get cart."});
    }
}

// PATCH /api/cart/update - update quantity of food in cart
export const updateCartItem = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {user_id, food_id, quantity} = req.body;

        if (!user_id || !food_id || !quantity) {
            res.status(400).json({
                success: false,
                message: "User ID, food ID, and quantity are required"});
            return;
        }

        if(quantity < 1){
            res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"});
            return;
        }

        const cart = await Cart.findOne({user_id: user_id});
        if (!cart) {
            res.status(404).json({
                success: false,
                message: "Cart not found"});
            return;
        }

        // find food in cart
        const itemIndex = cart.items.findIndex((item) => item.food_id.toString() === food_id.toString());
        if (itemIndex === -1) {
            res.status(404).json({
                success: false,
                message: "Food not found in cart"});
            return;
        }

        // update quantity and subtotal
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].subtotal = cart.items[itemIndex].price * quantity;

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart item updated successfully",
            cart
        });
    } catch (error) {
        res.status(500).json({
                success: false,
                message: "Server error. Could not update cart item."});
            return;
        }

}

// DELETE /api/cart/item - remove single item from cart
export const removeCartItem = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {user_id, food_id} = req.body;

        if (!user_id || !food_id) {
            res.status(400).json({
                success: false,
                message: "User ID and food ID are required"});
            return;
        }

        const cart = await Cart.findOne({user_id: user_id});
        if (!cart) {
            res.status(404).json({
                success: false,
                message: "Cart not found"});
            return;
        }

        // find food in cart
        const itemIndex = cart.items.findIndex((item) => item.food_id.toString() === food_id.toString());

        if (itemIndex === -1) {
            res.status(404).json({
                success: false,
                message: "Food not found in cart"});
            return;
        }

        const removedItemName = cart.items[itemIndex].name;

        // remove food from cart
        cart.items.splice(itemIndex, 1);

        await cart.save();

        res.status(200).json({
            success: true,
            message:` "${removedItemName}" removed from cart successfully.`,
            cart
        });
    } catch (error) {
        res.status(500).json({
                success: false,
                message: "Server error. Could not remove cart item."});
            return;
        }

}

// DELETE /api/cart/clear - clear cart
export const clearCart = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {userId} = req.params;

        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required"});
            return;
        }

        const cart = await Cart.findOne({user_id: userId});
        if (!cart) {
            res.status(404).json({
                success: false,
                message: "Cart not found"});
            return;
        }

        cart.items = [];
        cart.cart_total = 0;
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            cart
        });
    } catch (error) {
        res.status(500).json({
                success: false,
                message: "Server error. Could not clear cart."});
            return;
        }

}

