import mongoose from "mongoose";

let isConnected = false;

export const dbConnect = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }
  try {
    const conn = await mongoose.connect(`${process.env.MONGODB_URI}`);

    if (!conn) {
      isConnected = false;
      throw new Error("Database connection failed");
    }

    isConnected = conn.connection.readyState === 1;

    console.log("Database connected a successfully", conn.connection.host);
  } catch (error) {
    console.log("Error connecting to database", error);
  }
};
