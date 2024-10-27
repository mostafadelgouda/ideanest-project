const express = require("express");
const {
  getOrganizations,
  getOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  grantAccess,
} = require("../services/organizationService"); // Adjust the import path
const {
  getOrganizationValidator,
  createOrganizationValidator,
  updateOrganizationValidator,
  deleteOrganizationValidator,
} = require("../utils/validators/organizationValidator"); // Adjust the import path
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.use(authMiddleware);
router
  .route("/")
  .get(getOrganizations)
  .post(createOrganizationValidator, createOrganization);

router
  .route("/:id")
  .get(getOrganizationValidator, getOrganization)
  .put(updateOrganizationValidator, updateOrganization)
  .delete(deleteOrganizationValidator, deleteOrganization);
router.post("/:id/invite", grantAccess);

module.exports = router;
