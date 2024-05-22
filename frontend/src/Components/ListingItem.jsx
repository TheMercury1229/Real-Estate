import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
const ListingItem = ({ listing }) => {
  return (
    <div className="mx-auto w-[400px] md:w-[300px]   bg-white shadow:md transition-shadow duration-200 overflow-hidden rounded-lg">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiAgZiCuPuxMBjAPo__uWVM6ViyVjWzBhGlA&usqp=CAU"
          }
          alt="cover-image"
          className=" mx-auto  rounded-lg w-[390px] h-[250px] object-cover  transition-scale duration-200"
        />
        <div className="p-3 flex flex-col gap-1 w-full">
          <p className="text-lg font-bold text-slate-700 truncate">
            {listing.name}
          </p>
          <div className="flex gap-1 items-center">
            <MdLocationOn className="w-4 h-4 text-green-800" />
            <p className="text-sm text-gray-600 truncate">{listing.address}</p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p className="mt-1 font-semibold text-slate-500">
            ${" "}
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}{" "}
            /month
          </p>
          <div className="text-slate-800 flex gap-4">
            <div className="font-bold text-xs ">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Beds`
                : `${listing.bedrooms} Bed`}
            </div>
            <div className="font-bold text-xs ">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Baths`
                : `${listing.bathrooms} Bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem;
