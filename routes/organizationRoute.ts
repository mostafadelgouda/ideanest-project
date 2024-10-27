import express, { Request, Response } from "express";
import {
  getOrganizations,
  getOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  grantAccess,
} from "../services/organizationService"; 
import {
  getOrganizationValidator,
  createOrganizationValidator,
  updateOrganizationValidator,
  deleteOrganizationValidator,
} from "../utils/validators/organizationValidator"; 
import authMiddleware from "../middlewares/authMiddleware";

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

export default router;
