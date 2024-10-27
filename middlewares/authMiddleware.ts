import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";
import User, { IUser } from "../models/userModel";

interface AuthenticatedRequest extends Request {
  user?: IUser; 
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
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) {
    return next(new ApiError("Unauthorized: No token provided", 401));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const user = await User.findById(decoded.id).select("-password"); // Exclude password
    if (!user) {
      return next(new ApiError("Unauthorized: User not found", 401));
    }

    req.user = user; 
    next(); 
  } catch (error) {
    return next(new ApiError("Unauthorized: Invalid token", 401));
  }
};

export default authMiddleware;
