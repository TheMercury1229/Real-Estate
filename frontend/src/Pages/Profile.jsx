import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  list,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  logoutUserFailure,
  logoutUserStart,
  logoutUserSuccess,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { app } from "../firebaseConfig.js";
const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);
  const { currentUser } = user;
  const [listings, setListings] = useState([]);

  // Handling file upload
  const [file, setFile] = useState(undefined);
  const fileRef = useRef(null);
  const [filePercent, setFilePercent] = useState(0);
  const [fileErr, setFileErr] = useState(false);
  const [formData, setFormData] = useState({});
  const [showList, setShowList] = useState(false);
  // Uploading Image to the firebase
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(progress));
      },
      (error) => setFileErr(true),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  // Handling input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  // Handling the form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart(true));
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      toast.success("User Updated successfully");
    } catch (error) {
      toast.error("Error in user update");
      dispatch(updateUserFailure(error.message));
    }
  };
  // Handling Delete User
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      localStorage.setItem("persist:root", {});
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  // Logging Out user
  const handleLogout = async () => {
    try {
      dispatch(logoutUserStart());
      const res = await fetch("api/auth/signout");
      const data = res.json();
      if (data.message === false) {
        dispatch(logoutUserFailure(data.message));
        return;
      }
      dispatch(logoutUserSuccess(data));
    } catch (error) {
      logoutUserFailure(error);
    }
  };
  // Getting User Listings
  const getUserListings = async () => {
    try {
      setShowList(true);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message);
        return;
      }
      setListings(data);
    } catch (error) {
      toast.error("Error in showing listings");
    }
  };

  const handleDeleteListing = async (id) => {
    try {
      const res = await fetch(`/api/list/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setListings(listings.filter((listing) => listing._id !== id));
      getUserListings();
      toast.success("Listing is deleted successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <section className="sm:max-w-xl w-[80%] mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-6" onSubmit={handleFormSubmit}>
        <input
          type="file"
          ref={fileRef}
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          accept="image/*"
          className="w-[150px] h-[150px] object-cover cursor-pointer rounded-full mx-auto border-4 mt-2 border-gray-700"
        />
        {fileErr ? (
          <span className="text-red-800 text-center text-sm my-2">
            Error In image upload(Image should be less than 2MB)
          </span>
        ) : filePercent > 0 && filePercent < 100 ? (
          <span className="text-slate-800 text-center text-sm my-2">{`Uploading ${filePercent} % done`}</span>
        ) : filePercent == 100 ? (
          <span className="text-green-600 text-center text-sm my-2">
            File Uploaded Successfully
          </span>
        ) : (
          ""
        )}
        <input
          type="text"
          id="username"
          defaultValue={currentUser.username}
          placeholder="Username"
          onChange={handleInputChange}
          className="border p-3 rounded-lg outline-none"
        />
        <input
          type="text"
          id="email"
          defaultValue={currentUser.email}
          placeholder="Email"
          onChange={handleInputChange}
          className="border p-3 rounded-lg outline-none"
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="border p-3 rounded-lg outline-none"
        />
        <button
          disabled={loading}
          className="bg-slate-800 text-white p-3 rounded-lg uppercase hover:opacity-95 text-lg font-medium disabled:opacity-80"
        >
          {loading ? "Loading" : "Update Profile"}
        </button>

        <button
          type="button"
          className="bg-cyan-800 text-white p-3 rounded-lg uppercase hover:opacity-95 text-lg font-medium disabled:opacity-80"
        >
          <Link to={"/create-listing"} className="block w-full">
            Create Listing
          </Link>
        </button>
      </form>
      <div className="flex justify-between my-5 items-center">
        <span
          className="text-red-700 text-lg cursor-pointer hover:underline"
          onClick={handleDeleteUser}
        >
          Delete Account
        </span>
        <span
          className="text-red-700 text-lg cursor-pointer hover:underline"
          onClick={handleLogout}
        >
          Sign Out
        </span>
      </div>
      <p className="text-red-700">{error ? error.message : null}</p>
      <button className="text-slate-800 w-full text-center text-lg mb-4 ">
        <span
          className="border border-slate-800 rounded-lg p-2 hover:shadow-md"
          onClick={
            showList
              ? () => {
                  setShowList(false);
                }
              : () => getUserListings()
          }
        >
          {showList ? "Hide Listings" : "Show Listings"}
        </span>
      </button>

      {listings && listings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-5 text-3xl font-semibold">
            Your Listings
          </h1>
          {listings.map((item, i) => (
            <div
              key={item._id}
              className="flex border rounded-lg justify-between items-center p-3 gap-4"
            >
              <img
                src={item.imageUrls[0]}
                alt="listing-image"
                className="w-16 h-16 object-contain rounded-lg"
              />
              <Link to={`/listing/${item._id}`}>
                <p className="text-slate-700 font-semibold flex-1 hover:underline truncate">
                  {item.name}
                </p>
              </Link>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDeleteListing(item._id)}
                  className=" border p-2 text-red-700 border-red-700 rounded-md hover:shadow-lg disabled:opacity-80 uppercase text-sm"
                >
                  Delete
                </button>
                <button className=" border p-2 text-green-700 border-green-700 rounded-md hover:shadow-lg disabled:opacity-80 uppercase text-sm">
                  <Link to={`/update-listing/${item._id}`}>Edit</Link>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Profile;
