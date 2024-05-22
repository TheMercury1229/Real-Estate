import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { app } from "../firebaseConfig.js";
import { useNavigate } from "react-router-dom";
const CreateListing = () => {
  const { user } = useSelector((state) => state.user);
  const { currentUser } = user;
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  // Handling Image Upload
  const [files, setFiles] = useState([]);
  const storeImages = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = snapshot.bytesTransferred / snapshot.totalBytes;
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };
  const handleFileUpload = (e) => {
    if (files.length >= 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      if (files.length === 0) {
        toast.error("Select atleast one image");
        return;
      }
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImages(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          toast.success("Images uploaded successfully");
          setUploading(false);
        })
        .catch((err) => {
          toast.error("Image Upload Fail [2 MB max per image]");
          setUploading(false);
        });
    } else {
      toast.error("You can upload at max 6 images");
      setUploading(false);
    }
  };
  const handleImageDelete = (id) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== id),
    });
    toast.success("Image Deleted Successfully");
  };
  // Setting all the input changes and monitorring them
  const handleInputChange = (e) => {
    if (e.target.id === "sell" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (Number(formData.discountPrice) > Number(formData.regularPrice)) {
      toast.error("Discounted Price Must be less than the Regular Price");
      return;
    }
    if (formData.imageUrls.length < 0) {
      toast.error("Please Upload Atleast One Image");
    }
    try {
      setLoading(true);
      const res = await fetch("/api/list/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        toast.error(data.message);
        return;
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      toast.error("Error in submiting form");
      setLoading(false);
    }
  };
  return (
    <main className="p-3 w-[90%] max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold my-7 text-center">
        Create A Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            placeholder="Name"
            className="border p-3 rounded-lg"
            maxLength={62}
            minLength={10}
            required
            defaultValue={formData.name}
            onChange={handleInputChange}
          />
          <textarea
            type="text"
            id="description"
            placeholder="Description"
            className="border p-3 rounded-lg resize-none"
            required
            onChange={handleInputChange}
            value={formData.description}
          />
          <input
            type="name"
            id="address"
            placeholder="Address"
            className="border p-3 rounded-lg"
            required
            onChange={handleInputChange}
            value={formData.address}
          />
          <div className="flex items-center gap-8 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sell"
                className="w-5 accent-slate-800"
                onChange={handleInputChange}
                checked={formData.type === "sell"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5 accent-slate-800"
                onChange={handleInputChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5 accent-slate-800"
                onChange={handleInputChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5 accent-slate-800"
                onChange={handleInputChange}
                checked={formData.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5 accent-slate-800"
                onChange={handleInputChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap justify-start">
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={10}
                width="20px"
                id="bedrooms"
                required
                className="border border-gray-300 rounded-lg p-3"
                onChange={handleInputChange}
                value={formData.bedrooms}
              />
              <span>Beds</span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={10}
                id="bathrooms"
                width="20px"
                required
                className="border border-gray-300 rounded-lg p-3"
                onChange={handleInputChange}
                value={formData.bathrooms}
              />
              <span>Bathrooms</span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                id="regularPrice"
                required
                width="20px"
                min={50}
                className="border border-gray-300 rounded-lg p-3"
                onChange={handleInputChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <span>Regular Price</span>
                <span className="text-sm">($ / Month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  id="discountPrice"
                  required
                  min={0}
                  width="20px"
                  className="border border-gray-300 rounded-lg p-3"
                  onChange={handleInputChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center ">
                  <span>Discounted Price</span>
                  <span className="text-sm">($ / Month)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className=" flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-600 ml-2">
              The first image will be cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="images/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              disabled={uploading}
              type="button"
              className=" border p-3 text-green-700 border-green-700 rounded-md hover:shadow-lg disabled:opacity-80 uppercase"
              onClick={handleFileUpload}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((imageUrl, i) => (
              <div
                className="flex items-center justify-between p-4 border"
                key={imageUrl}
              >
                <img
                  alt="listing-image"
                  src={imageUrl}
                  className="w-20 h-20 rounded-lg object-contain"
                />
                <button
                  disabled={uploading}
                  type="button"
                  onClick={() => handleImageDelete(i)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-95 border border-red-700 hover:shadow-md"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading}
            onClick={handleSubmitForm}
            className="bg-slate-800 text-white p-3 rounded-lg uppercase hover:opacity-95 text-lg font-medium disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
