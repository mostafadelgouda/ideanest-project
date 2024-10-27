import { UUID } from "crypto";
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  _id: UUID;
}

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

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
