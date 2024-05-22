import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../Components/ListingItem";
const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [sellListings, setSellListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`/api/list/get?offer=true&limit=4`);
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch(`/api/list/get?type=rent&limit=4`);
        const data = await res.json();
        setRentListings(data);
        fetchSellListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSellListings = async () => {
      try {
        const res = await fetch(`/api/list/get?type=sell&limit=4`);
        const data = await res.json();
        setSellListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <main>
      {/* Top */}
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-semibold text-4xl lg:text-6xl ">
          Find your next <span className="text-slate-500">perfect</span>
          <br /> place with ease
        </h1>
        <div className="text-gray-500 text-sm ">
          HgEsate will help you find your home fast, easy and comfortable. Our
          expert support are always available.
        </div>
        <Link
          to={"/search"}
          className="text-sm sm:text-lg text-blue-900 font-bold hover:underline"
        >
          Let`s get Started
        </Link>
      </div>
      {/* Swipper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      {/* Listing Results */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl text-slate-700 font-semibold">
                Recent Offers
              </h2>
              <Link
                to="/search?offer=true"
                className="text-sm text-blue-900 hover:underline"
              >
                Show More Offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl text-slate-700 font-semibold">
                Recent Places For Rent
              </h2>
              <Link
                to="/search?type=rent"
                className="text-sm text-blue-900 hover:underline"
              >
                Show More Places for Rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {sellListings && sellListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl text-slate-700 font-semibold">
                Recent Places for Sell
              </h2>
              <Link
                to="/search?type=sell"
                className="text-sm text-blue-900 hover:underline"
              >
                Show More Places for Sell
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {sellListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
