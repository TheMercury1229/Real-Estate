import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import { Navigation } from "swiper/modules";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { Contact } from "../Components";
import { useSelector } from "react-redux";
const Listing = () => {
  SwiperCore.use([Navigation]);
  const { user } = useSelector((state) => state.user);
  const { currentUser } = user;
  const [copied, setCopied] = useState(false);
  const [listing, setListing] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const params = useParams();
  //  Getting The Data from the api
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/list/get/${params.listingID}`);
        const data = await res.json();
        if (data.success === false) {
          toast.error(data.message);
          setLoading(false);
          setError(true);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        setError(true);
      }
    };
    fetchListing();
  }, [params.listingID]);
  return (
    <>
      {loading && <p className="text-center text-3xl my-10">Loading...</p>}
      {error && (
        <p className="text-center text-3xl my-10 text-red-600">
          Something Went Wrong
        </p>
      )}
      {listing && !loading && !error && (
        <>
          <Swiper navigation className="my-1">
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[400px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center  gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-slate-600 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-sky-700 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  $
                  {String(
                    +listing.regularPrice - +listing.discountPrice
                  ).toLocaleString("en-US")}{" "}
                  Discount
                </p>
              )}
            </div>
            {copied && (
              <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
                Link copied!
              </p>
            )}
            <p className="text-slate-700">
              <span className="font-semibold text-black">Description</span> -{" "}
              {listing.description}
            </p>
            <ul className="flex flex-wrap items-center gap-4 sm:gap-6 text-green-900 font-semibold text-sm">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed className="text-lg " />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Beds`
                  : `${listing.bedrooms} Bed`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath className="text-lg " />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : `${listing.bathrooms} Bath`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaParking className="text-lg " />
                {listing.parking ? `Parking Spot` : `No Parking`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaChair className="text-lg " />
                {listing.furnished ? `Furnished` : `Unfurnished`}
              </li>
            </ul>
            {currentUser &&
              !showContact &&
              listing.userRef !== currentUser._id && (
                <button
                  onClick={() => setShowContact(true)}
                  className="bg-slate-800 font-semibold mt-5 rounded-lg hover:opacity-95 p-4 max-w-[500px] text-xl text-white capitalize mx-auto"
                >
                  Contact Landlord
                </button>
              )}
            {showContact && <Contact listing={listing} />}
          </div>
        </>
      )}
    </>
  );
};

export default Listing;
