import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Home,
  About,
  SignIn,
  SignUp,
  Profile,
  CreateListing,
  UpdateListing,
  Listing,
  SearchPage,
} from "./Pages";
import { Header, ProtectedRoute } from "./Components";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/sign-in" element={<SignIn />}></Route>
          <Route path="/sign-up" element={<SignUp />}></Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/create-listing" element={<CreateListing />}></Route>
            <Route
              path="/update-listing/:listingID"
              element={<UpdateListing />}
            ></Route>
          </Route>
          <Route path="/listing/:listingID" element={<Listing />}></Route>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
