const { check, param, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getOrganizationValidator = [
  param("id").isMongoId().withMessage("Invalid organization id format"),
  validatorMiddleware,
];

exports.createOrganizationValidator = [
  body("name")
    .notEmpty()
    .withMessage("Organization name is required")
    .isLength({ min: 3, max: 32 })
    .withMessage(
      "Organization name length should be between 3 and 32 characters"
    ),
  body("description")
    .notEmpty()
    .withMessage("Organization description is required")
    .isLength({ min: 3 })
    .withMessage("Organization description is too short"),
  validatorMiddleware,
];

exports.updateOrganizationValidator = [
  param("id").isMongoId().withMessage("Invalid organization id format"),
  body("name")
    .optional()
    .isLength({ min: 3, max: 32 })
    .withMessage(
      "Organization name length should be between 3 and 32 characters"
    ),
  body("description")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Organization description is too short"),
  validatorMiddleware,
];

exports.deleteOrganizationValidator = [
  param("id").isMongoId().withMessage("Invalid organization id format"),
  validatorMiddleware,
];
