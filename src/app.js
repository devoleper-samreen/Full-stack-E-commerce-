import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./db/db.js";
import cookieParser from "cookie-parser";

//env setup
dotenv.config(
    {
        path: "./.env"
    }
)

//basic setup
const port =  process.env.PORT || 4000;
const app = express();
app.use(express.json())
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
))
app.use(cookieParser())

// importing routes
import userRoute  from "./routes/user.js"
import productRoute from "./routes/product.js"
import searchSortRoute from "./routes/search&sort.js"
import cartRoute from "./routes/cart.js"
import categoryRoute from "./routes/category.js"
import profileRoute from "./routes/user.js"
import orderRoutes from "./routes/order.js"

// using routes
app.use("/api/v1/user", userRoute)
app.use("/api/v1/category", categoryRoute)
app.use("/api/v1/product", productRoute)
app.use("/api/v1/search", searchSortRoute)
app.use("/api/v1/cart", cartRoute)
app.use("/api/v1/profile", profileRoute)
app.use("/api/v1/orders", orderRoutes)

//app listining
app.listen(port, () => {
    console.log(`server is working on http://localhost:${port}`)
})

// connect DB
connectDB()

