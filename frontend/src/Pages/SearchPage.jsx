import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ListingItem from "../Components/ListingItem";
const SearchPage = () => {
  const navigate = useNavigate();
  const [sideBarData, setSideBarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sell"
    ) {
      setSideBarData({ ...sideBarData, type: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setSideBarData({ ...sideBarData, searchTerm: e.target.value });
    }
    if (
      e.target.id === "furnished" ||
      e.target.id === "parking" ||
      e.target.id === "offer"
    ) {
      setSideBarData({
        ...sideBarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSideBarData({ ...sideBarData, sort, order });
    }
  };
  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sideBarData.searchTerm);
    urlParams.set("type", sideBarData.type);
    urlParams.set("parking", sideBarData.parking);
    urlParams.set("furnished", sideBarData.furnished);
    urlParams.set("offer", sideBarData.offer);
    urlParams.set("sort", sideBarData.sort);
    urlParams.set("order", sideBarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSideBarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        order: orderFromUrl || "desc",
        sort: sortFromUrl || "created_at",
      });
    }
    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const response = await fetch(`/api/list/get?${searchQuery}`);
      const data = await response.json();
      if (data.success === false) {
        setLoading(false);
        toast.error(data.message);
        return;
      }
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListing(data);
      setLoading(false);
    };
    fetchListings();
  }, [location.search]);
  const onShowMoreClick = async () => {
    const numOfListings = listing.length;
    const startIndex = numOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const response = await fetch(`/api/list/get?${searchQuery}`);
    const data = await response.json();
    if (data.success === false) {
      toast.error(data.message);
      return;
    }
    if (data.length < 9) {
      setShowMore(false);
    } else {
      setShowMore(true);
    }
    setListing([...listing, ...data]);
  };
  return (
    <main className="flex flex-col md:flex-row flex-1">
      <aside className="w-full md:w-1/4 p-7 border-b-2 md:border-r-2 border-gray-400 md:min-h-[100vh] flex-shrink-0">
        <form className="flex flex-col gap-8" onSubmit={handleSearchFormSubmit}>
          <div className="flex items-center gap-3">
            <label
              className="text-lg font-semibold whitespace-nowrap"
              htmlFor="search"
            >
              Search Term
            </label>
            <input
              type="text"
              value={sideBarData.searchTerm}
              onChange={handleChange}
              id="searchTerm"
              name="search"
              className="border rounded-lg p-3 w-full"
              placeholder="Search..."
            />
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <label className="font-semibold">Type</label>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                id="all"
                onChange={handleChange}
                checked={sideBarData.type === "all"}
                className="h-5 w-4 accent-slate-800"
              />
              <span>Rent and Sell</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                id="rent"
                className="h-5 w-4 accent-slate-800"
                onChange={handleChange}
                checked={sideBarData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                id="sell"
                onChange={handleChange}
                checked={sideBarData.type === "sell"}
                className="h-5 w-4 accent-slate-800"
              />
              <span>Sell</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                id="offer"
                onChange={handleChange}
                checked={sideBarData.offer}
                className="h-5 w-4 accent-slate-800"
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <label className="font-semibold">Ammenities</label>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                id="furnished"
                onChange={handleChange}
                checked={sideBarData.furnished}
                className="h-5 w-4 accent-slate-800"
              />
              <span>Furnished</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                id="parking"
                onChange={handleChange}
                checked={sideBarData.parking}
                className="h-5 w-4 accent-slate-800"
              />
              <span>Parking</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label>Sort</label>
            <select
              id="sort_order"
              onChange={handleChange}
              defaultValue={"createdAt_desc"}
              className="border rounded-lg p-2 outline-none"
            >
              <option value="regularPrice_desc">Price High to Low</option>
              <option value="regularPrice_asc">Price Low to High</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-800 font-semibold mt-5 rounded-lg hover:opacity-95 p-4 max-w-[500px] text-2xl text-white capitalize">
            Search
          </button>
        </form>
      </aside>
      <section className="w-full md:w-3/4 p-3">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing Results
        </h1>
        <div className="mt-7 flex flex-col md:gap-4 gap-6">
          {!loading && listing.length === 0 && (
            <p className="text-xl text-center text-slate-800">
              No Listing Found
            </p>
          )}
          {loading && (
            <p className="text-xl text-center text-slate-800">Loading...</p>
          )}
          <div className="flex flex-col md:flex-row md:items-center gap-4 flex-wrap">
            {listing &&
              !loading &&
              listing.map((listing) => (
                <ListingItem key={`${listing._id}`} listing={listing} />
              ))}

            {showMore && (
              <button
                className="p-2 text-lg border-2 border-gray-600 w-full"
                onClick={onShowMoreClick}
              >
                Show More
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default SearchPage;
