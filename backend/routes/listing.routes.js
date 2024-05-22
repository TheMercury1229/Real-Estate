import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getAllListings,
} from "../controllers/listing.controller.js";
import { verifyUser } from "../utils/verifyUser.js";
const listingRouter = express.Router();

listingRouter.post("/create", verifyUser, createListing);
listingRouter.delete("/delete/:id", verifyUser, deleteListing);
listingRouter.post("/update/:id", verifyUser, updateListing);
listingRouter.get("/get/:id", getListing);
listingRouter.get("/get", getAllListings);
export default listingRouter;
