import express, {Application} from "express"
import dotenv from "dotenv"


dotenv.config()

const app: Application = express();

// middleware
app.use(express.json());

// routes
// import userRoutes from "@/routes/userRoutes"
// import foodRoutes from "@/routes/foodRoutes"
// import cartRoutes from "@/routes/cartRoutes"
// import orderRoutes from "@/routes/orderRoutes"

// app.use("/api", userRoutes);
// app.use("/api", foodRoutes);
// app.use("/api", cartRoutes);
// app.use("/api", orderRoutes);

export default app;