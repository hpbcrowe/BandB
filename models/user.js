import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
//import { unique } from "next/dist/build/utils";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: 1,
      maxLength: 20,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      index: true,
      lowercase: true,
      unique: true,
      trim: true,
      minLength: 5,
      maxLength: 30,
    },
    password: String,
    role: {
      type: String,
      default: "user", //admin or user
    },
    image: String,
    resetCode: {
      data: String,
      expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    },
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);

//export the model if it exists, create it if it doesn't
export default mongoose.models.User || mongoose.model("User", userSchema);
