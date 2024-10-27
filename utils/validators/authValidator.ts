import { body } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

const messages = {
  required: (field: string) => `${field} is required`,
  invalidEmail: "Invalid email format",
  passwordLength: "Password must be at least 6 characters long",
  nameLength: "Name length should be between 3 and 32 characters",
};

export const registerValidator = [
  body("name")
    .notEmpty()
    .withMessage(messages.required("Name"))
    .isLength({ min: 3, max: 32 })
    .withMessage(messages.nameLength),
  body("email")
    .notEmpty()
    .withMessage(messages.required("Email"))
    .isEmail()
    .withMessage(messages.invalidEmail),
  body("password")
    .notEmpty()
    .withMessage(messages.required("Password"))
    .isLength({ min: 6 })
    .withMessage(messages.passwordLength),
    // Uncomment for additional password validation:
    // .matches(/(?=.*[0-9])/, "g")
    // .withMessage("Password must contain at least one number")
    // .matches(/(?=.*[!@#$%^&*])/, "g")
    // .withMessage("Password must contain at least one special character"),
  validatorMiddleware
];

export const signinValidator = [
  body("email")
    .notEmpty()
    .withMessage(messages.required("Email"))
    .isEmail()
    .withMessage(messages.invalidEmail),
  body("password").notEmpty().withMessage(messages.required("Password")),
  validatorMiddleware,
];
