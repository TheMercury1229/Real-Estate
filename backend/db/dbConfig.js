import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI).then(() => {
      console.log("DB successfully connected");
    });
  } catch (error) {
    console.log("Mongo DB connection error", error);
  }
};

export default connectDB;
