import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGODB_URI}`);

    if (!conn) throw new Error("Database connection failed");

    console.log("Database connected a successfully");
  } catch (error) {
    console.log("Error connecting to database", error);
  }
};
