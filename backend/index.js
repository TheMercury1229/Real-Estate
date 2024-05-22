import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./db/dbConfig.js";
import { userRouter, authRouter, listingRouter } from "./routes/routesIndex.js";
dotenv.config();
const app = express();
const port = 3000;
// Connecting DB
connectDB();
// Starting The Server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
// Configuring the app
app.use(express.json());
app.use(cookieParser());
// API Endpoints
app.use("/api/user", userRouter); // User endpoint
app.use("/api/auth", authRouter); //Auth endpoint
app.use("/api/list", listingRouter); //Listings endpoint

// Middlewares
// Middleware for handling errors
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
