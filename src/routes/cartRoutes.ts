import express, { Router } from "express";
import { addToCart, getCart, updateCartItem, removeCartItem, clearCart } from "../controllers/cartController";

const router: Router = express.Router();

router.post("/cart", addToCart);
router.get("/cart/:userId", getCart);
router.patch("/cart/update", updateCartItem);
router.delete("/cart/item", removeCartItem);
router.delete("/cart/:userId", clearCart);

export default router;
