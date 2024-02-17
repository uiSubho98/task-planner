import { model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../../config";
import IUser from "./user.interface";
import { ApiError } from "../../utils/ApiError";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      index: true,
    },
    refreshToken: { type: String },
    isLogin: { type: Boolean },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } else {
    next();
  }
});
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    config.access_token_secret as string,
    {
      expiresIn: config.access_token_expiry,
    }
  );
};
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    // Handle errors
    throw new ApiError(500, "Something went wrong while comparing passwords");
  }
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    config.refresh_token_secret as string,
    {
      expiresIn: config.refresh_token_expiry,
    }
  );
};

export const User = model<IUser>("User", userSchema);
