import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebaseConfig.js";
import { useDispatch } from "react-redux";
import { singInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
const GoogleAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      // Configuring
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      //   Sending Request
      const result = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(singInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("Could not sign in with google", error);
    }
  };
  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-blue-800  text-white p-4 rounded-lg uppercase hover:opacity-95 text-lg font-medium "
    >
      Continue With Google
    </button>
  );
};

export default GoogleAuth;
