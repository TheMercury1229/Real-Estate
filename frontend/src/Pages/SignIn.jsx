import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  singInFailure,
  singInSuccess,
} from "../redux/user/userSlice.js";
import { GoogleAuth } from "../Components/index.js";
const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const onChangeInputHandler = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(singInFailure(data.message));
        return;
      }
      dispatch(singInSuccess(data));
      toast.success("User Logged In Successfully");
      navigate("/");
    } catch (error) {
      dispatch(singInFailure(error.message));
    }
  };
  return (
    <section className="sm:max-w-lg mx-auto w-[80%]">
      <h1 className="text-3xl text-center font-semibold my-8">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg text-lg  outline-none"
          id="email"
          onChange={onChangeInputHandler}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 text-lg  rounded-lg outline-none"
          id="password"
          onChange={onChangeInputHandler}
        />
        <button
          disabled={loading}
          className="bg-slate-800 text-white p-4 rounded-lg uppercase hover:opacity-95 text-lg font-medium disabled:opacity-80"
        >
          {loading ? "Loading" : "Sign In"}
        </button>
        <GoogleAuth />
      </form>
      <div className="mt-3 flex items-center gap-2 text-lg">
        <p>Dont have an account ?</p>
        <Link to="/sign-up">
          <span className="text-semibold hover:underline text-blue-800">
            Sign Up
          </span>
        </Link>
      </div>
      {error && (
        <p className="text-red-500 mt-3 text-center">{toast.error(error)}</p>
      )}
    </section>
  );
};

export default SignIn;
