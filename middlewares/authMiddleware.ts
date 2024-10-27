import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";
import User, { IUser } from "../models/userModel"; // Import the User model with type

interface AuthenticatedRequest extends Request {
  user?: IUser; // Define user property type on the Request
  headers: Authorization;

}
interface Authorization {
  authorization: string;
}

const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Get token from headers
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) {
    return next(new ApiError("Unauthorized: No token provided", 401));
  }

  try {
    // Verify token and define the payload type
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

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

export default authMiddleware;
