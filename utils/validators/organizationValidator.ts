import { param, body } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

// Centralized error messages
const messages = {
  invalidId: "Invalid organization id format",
  required: (field: string) => `${field} is required`,
  nameLength: "Organization name length should be between 3 and 32 characters",
  descriptionLength: "Organization description is too short",
};

export const getOrganizationValidator = [
  param("id").isMongoId().withMessage(messages.invalidId),
  validatorMiddleware,
];

export const createOrganizationValidator = [
  body("name")
    .notEmpty()
    .withMessage(messages.required("Organization name"))
    .isLength({ min: 3, max: 32 })
    .withMessage(messages.nameLength),
  body("description")
    .notEmpty()
    .withMessage(messages.required("Organization description"))
    .isLength({ min: 3 })
    .withMessage(messages.descriptionLength),
  validatorMiddleware,
];

export const updateOrganizationValidator = [
  param("id").isMongoId().withMessage(messages.invalidId),
  body("name")
    .optional()
    .isLength({ min: 3, max: 32 })
    .withMessage(messages.nameLength),
  body("description")
    .optional()
    .isLength({ min: 3 })
    .withMessage(messages.descriptionLength),
  validatorMiddleware,
];

export const deleteOrganizationValidator = [
  param("id").isMongoId().withMessage(messages.invalidId),
  validatorMiddleware,
];
