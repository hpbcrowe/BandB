import { DB_URI } from "@/config";
import mongoose from "mongoose";

const dbConnect = async () => {
  if (mongoose.Connection.readyState >= 1) {
    return;
  }
  mongoose.connect(DB_URI);
};

export default dbConnect;
