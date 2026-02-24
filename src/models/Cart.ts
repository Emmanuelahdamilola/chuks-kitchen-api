import mongoose, { Document, Schema } from "mongoose";

export interface ICartItem {
  food_id: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface ICartDocument extends Document {
  user_id: mongoose.Types.ObjectId;
  items: ICartItem[];
  cart_total: number;
}

const CartItemSchema = new Schema(
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

const CartSchema: Schema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true, 
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
    cart_total: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Auto-calculate cart total before every save
CartSchema.pre("save", async function (this: ICartDocument) {
  this.cart_total = this.items.reduce(
    (total: number, item: ICartItem) => total + item.subtotal,
    0
  );
});

export default mongoose.model<ICartDocument>("Cart", CartSchema);