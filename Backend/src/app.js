import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db/db.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import searchSortRoute from "./routes/search&sort.js";
import cartRoute from "./routes/cart.js";
import categoryRoute from "./routes/category.js";
import readProductRoute from "./routes/userReadProduct.js"

// Environment Setup
dotenv.config({ path: "./.env" });

// Basic Setup
const port = process.env.PORT || 4000;
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS Setup
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce API!');
});

// Importing Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/read", readProductRoute)
app.use("/api/v1/search", searchSortRoute);
app.use("/api/v1/cart", cartRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Server Listening
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Connect DB
connectDB();
