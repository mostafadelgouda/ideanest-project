import express, { Request, Response } from "express";
import {
  getOrganizations,
  getOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  grantAccess,
} from "../services/organizationService"; // Adjust the import path
import {
  getOrganizationValidator,
  createOrganizationValidator,
  updateOrganizationValidator,
  deleteOrganizationValidator,
} from "../utils/validators/organizationValidator"; // Adjust the import path
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Define routes
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

export default router;
