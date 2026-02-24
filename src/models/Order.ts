import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
  food_id: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Preparing"
  | "Out for Delivery"
  | "Completed"
  | "Cancelled";

export interface IOrderDocument extends Document {
  user_id: mongoose.Types.ObjectId;
  items: IOrderItem[];
  total_price: number;
  status: OrderStatus;
  cancellation_reason?: string;
  cancelled_by?: "Customer" | "Admin";
}

const OrderItemSchema = new Schema(
  {
    food_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    price: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const OrderSchema: Schema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    items: {
      type: [OrderItemSchema],
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Preparing",
        "Out for Delivery",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },
    cancellation_reason: {
      type: String,
      trim: true,
    },
    cancelled_by: {
      type: String,
      enum: ["Customer", "Admin"],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrderDocument>("Order", OrderSchema);