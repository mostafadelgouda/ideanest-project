const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel"); // Import your User model

const authMiddleware = async (req, res, next) => {
  // Get token from headers
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) {
    return next(new ApiError("Unauthorized: No token provided", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user information from the database
    const user = await User.findById(decoded.id).select("-password"); // Exclude password
    if (!user) {
      return next(new ApiError("Unauthorized: User not found", 401));
    }

    req.user = user; // Attach full user info to request
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    return next(new ApiError("Unauthorized: Invalid token", 401));
  }
};

module.exports = authMiddleware;
