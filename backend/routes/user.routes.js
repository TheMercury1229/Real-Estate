import express from "express";
import {
  deleteUser,
  updateUser,
  getUserListing,
  getUser,
} from "../controllers/user.controllers.js";
import { verifyUser } from "../utils/verifyUser.js";

const userRouter = express.Router();

userRouter.post("/update/:id", verifyUser, updateUser);
userRouter.delete("/delete/:id", verifyUser, deleteUser);
userRouter.get("/listings/:id", verifyUser, getUserListing);
userRouter.get("/:id", verifyUser, getUser);
export default userRouter;
