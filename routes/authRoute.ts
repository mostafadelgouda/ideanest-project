import express, { Request, Response } from "express";
import {
  registerUser,
  signinUser,
  getMe,
  refreshToken,
} from "../services/authService"; 
import {
  registerValidator,
  signinValidator,
} from "../utils/validators/authValidator";

const router = express.Router();
router.post("/signup", registerValidator, registerUser);
router.post("/signin", signinValidator, signinUser);
router.get("/me", getMe);
router.post("/refresh-token", refreshToken);

export default router;
