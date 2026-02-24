import { Router } from "express";
import {
  placeOrder,
  getOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController";

const router: Router = Router();

router.post("/orders", placeOrder);                       
router.get("/orders", getAllOrders);                      
router.get("/orders/user/:userId", getUserOrders);        
router.get("/orders/:id", getOrder);                      
router.patch("/orders/:id/status", updateOrderStatus);    
router.patch("/orders/:id/cancel", cancelOrder);          

export default router;