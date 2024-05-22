import Listing from "../models/listing.models.js";
import { errorHandler } from "../utils/error.js";

// Create A Listing

export const createListing = async (req, res, next) => {
  try {
    const newListing = await Listing.create(req.body);
    return res.status(201).json(newListing);
  } catch (error) {
    next(error);
  }
};

// Delete a listing

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    next(errorHandler(404, "Listing Not Found"));
    return;
  }
  if (req.id === listing.userRef) {
    next(errorHandler(401, "You can delete only your won listing"));
    return;
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Deleted Successfully");
  } catch (error) {
    next(error);
  }
};

// Update a Listing

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    next(errorHandler(404, "Listing Not Found"));
    return;
  }
  if (req.id === listing.userRef) {
    next(errorHandler(401, "You can edit only your won listing"));
    return;
  }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

// Get A Listing

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing Not Found"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

// Fetch All the listings

export const getAllListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const strIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }
    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }
    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sell", "rent"] };
    }
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({
        [sort]: order,
      })
      .limit(limit)
      .skip(strIndex);
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
