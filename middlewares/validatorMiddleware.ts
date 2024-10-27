import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

const validatorMiddleware = (req: Request, res: Response, next: NextFunction): Response | void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export default validatorMiddleware;
