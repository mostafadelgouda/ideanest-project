const express = require("express");
const {
  registerUser,
  signinUser,
  getMe,
  refreshToken,
} = require("../services/authService"); // Adjust the import path
const {
  registerValidator,
  signinValidator,
} = require("../utils/validators/authValidator"); // Adjust the import path

const router = express.Router();

// @desc Register a new user
// @route POST /api/v1/auth/register
// @access Public
router.post("/register", registerValidator, registerUser);

// @desc signin a user
// @route POST /api/v1/auth/signin
// @access Public
router.post("/signin", signinValidator, signinUser);

// @desc Get current user details
// @route GET /api/v1/auth/me
// @access Private
router.get("/me", getMe); // Assuming you have middleware to authenticate the user

router.post("/refresh-token", refreshToken);

module.exports = router;
