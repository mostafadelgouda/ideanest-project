const User = require("../models/userModel"); // Adjust the import path
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ApiError("User already exists", 400));
  }

  const saltRounds = parseInt(process.env.SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.status(201).json({
    message: "User registered successfully",
    // accessToken,
    // refreshToken,
    // id: user._id,
    // name: user.name,
    // email: user.email,
  });
});

exports.signinUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError("Invalid email or password", 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ApiError("Invalid email or password", 401));
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.status(200).json({
    message: "user logged in successfully",
    accessToken,
    refreshToken,
    // id: user._id,
    // name: user.name,
    // email: user.email,
  });
});

// @desc Get user details
// @route GET /api/v1/auth/me
// @access Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const userId = req.user.id; // Assuming you have middleware to set req.user
  const user = await User.findById(userId).select("-password"); // Exclude password from response

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  res.status(200).json(user);
});

// @desc Refresh access token
// @route POST /api/v1/auth/refresh-token
// @access Public
exports.refreshToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.body.refresh_token;

  if (!refreshToken) {
    return next(new ApiError("Refresh token is required", 400));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken(decoded.id);

    res
      .status(200)
      .json({
        message: "Access Token has been generated",
        access_token: accessToken,
        refresh_token: refreshToken,
      });
  } catch (error) {
    return next(new ApiError("Invalid refresh token", 401));
  }
});
