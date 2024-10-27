import express, { Request, Response } from "express";
import {
  registerUser,
  signinUser,
  getMe,
  refreshToken,
} from "../services/authService"; // Adjust the import path
import {
  registerValidator,
  signinValidator,
} from "../utils/validators/authValidator"; // Adjust the import path

const router = express.Router();

// @desc Register a new user
// @route POST /api/v1/auth/register
// @access Public
router.post("/register", registerValidator, registerUser);

// @desc Sign in a user
// @route POST /api/v1/auth/signin
// @access Public
router.post("/signin", signinValidator, signinUser);

// @desc Get current user details
// @route GET /api/v1/auth/me
// @access Private
router.get("/me", getMe); // Assuming you have middleware to authenticate the user

// @desc Refresh token
// @route POST /api/v1/auth/refresh-token
// @access Public
router.post("/refresh-token", refreshToken);

export default router;
