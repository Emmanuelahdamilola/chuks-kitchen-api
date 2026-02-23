import {Router} from "express";
import {signup, verifyOTP, resendOTP, signin, getCurrentUser} from "../controllers/userController";

const router = Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/signin", signin);
router.get("/users/:id", getCurrentUser);

export default router;
