import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Header = () => {
  const { user } = useSelector((state) => state.user);
  const { currentUser } = user;
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  return (
    <header className="bg-slate-300 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
        <Link to="/">
          <h1 className="font-bold text-xl sm:text-2xl flex flex-wrap select-none">
            <span className="text-slate-600">Hg</span>
            <span className="text-slate-800">Estate</span>
          </h1>
        </Link>

        <form
          onSubmit={handleSearchSubmit}
          className="bg-slate-100 p-2 rounded-md flex justify-between items-center"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="bg-transparent outline-none w-24 sm:w-60"
          />
          <button>
            <FaSearch className="text-slate-900" />
          </button>
        </form>

        <ul className="flex gap-4 items-center">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline text-lg font-semibold">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline text-lg font-semibold">
              About
            </li>
          </Link>

          <li>
            {currentUser ? (
              <Link to="/profile">
                <img
                  src={currentUser.avatar}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </Link>
            ) : (
              <Link to="/sign-in">
                <button className="py-2 px-4 text-white bg-slate-800 text-lg  font-semibold rounded-md hover:shadow-md hover:opacity-95">
                  Sign In
                </button>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
