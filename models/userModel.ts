import { UUID } from "crypto";
import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the user schema
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  _id: UUID;
}

// Define the user schema
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name required"],
      minlength: [3, "User name is too short"],
      maxlength: [32, "User name is too long"],
    },
    email: {
      type: String,
      required: [true, "Email address required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
  },
  { timestamps: true }
);

// Create and export the user model
const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
