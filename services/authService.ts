import User from "../models/userModel"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError";
import { Request, Response, NextFunction } from "express";

const generateAccessToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};

const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

export const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ApiError("User already exists", 400));
  }

  const saltRounds = parseInt(process.env.SALT_ROUNDS as string);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  res.status(201).json({
    message: "User registered successfully",
    // access_token: accessToken,
    // refresh_token: refreshToken,
    // id: user._id,
    // name: user.name,
    // email: user.email,
  });
});

export const signinUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError("Invalid email or password", 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ApiError("Invalid email or password", 401));
  }

  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  res.status(200).json({
    message: "User logged in successfully",
    access_token: accessToken,
    refresh_token: refreshToken,
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.id; 
  const user = await User.findById(userId).select("-password");

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  res.status(200).json(user);
});

export const refreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.body.refresh_token;

  if (!refreshToken) {
    return next(new ApiError("Refresh token is required", 400));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);
    const accessToken = generateAccessToken(decoded.id as string);

    res.status(200).json({
      message: "Access Token has been generated",
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    return next(new ApiError("Invalid refresh token", 401));
  }
});
