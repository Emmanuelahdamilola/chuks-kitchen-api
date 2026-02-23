import {Router} from "express";
import {getAllFoods, addFood, getFoodById, updateFood, deleteFood} from "../controllers/foodController";
import upload from "../middleware/upload";


const router = Router();

router.get("/foods", getAllFoods);
router.post("/foods/create", upload.single("image"), addFood);
router.get("/foods/:id", getFoodById);
router.patch("/foods/:id", upload.single("image"), updateFood);
router.delete("/foods/:id", deleteFood);

export default router;