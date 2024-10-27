const Organization = require("../models/organizationModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel"); // Assuming you have a User model

exports.getOrganizations = asyncHandler(async (req, res) => {
  const limit = req.query.limit * 1 || 20;
  const page = req.query.page * 1 || 1;

  // Find organizations where the current user is a member
  const organizations = await Organization.find({
    "organizationMembers.email": req.user.email,
  })
    .select("_id name description organizationMembers") // Only retrieve specified fields
    .skip((page - 1) * limit)
    .limit(limit);

  // Transform the data to match the response schema
  const formattedOrganizations = organizations.map((org) => ({
    organization_id: org._id,
    name: org.name,
    description: org.description,
    organization_members: org.organizationMembers.map((member) => ({
      name: member.name,
      email: member.email,
      access_level: member.accessLevel,
    })),
  }));

  res.status(200).json(formattedOrganizations);
});

exports.getOrganization = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const organization = await Organization.findById(id);

  if (!organization) {
    return next(new ApiError("No organization found for this id", 404));
  }

  // Check if the current user is a member of the organization
  const isMember = organization.organizationMembers.some(
    (member) => member.email === req.user.email
  );
  if (!isMember) {
    return next(new ApiError("You are not a member of this organization", 403));
  }

  res.status(200).json({
    organization_id: organization._id,
    name: organization.name,
    description: organization.description,
    organization_members: organization.organizationMembers,
  });
});

exports.createOrganization = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  //console.log(req.user);
  const organization = await Organization.create({
    name,
    slug: slugify(name),
    description,
    organizationMembers: [
      { name: req.user.name, email: req.user.email, accessLevel: "creator" },
    ],
  });
  res.status(201).json({ organization_id: organization._id });
});

exports.updateOrganization = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const { name, description } = req.body;

  const organization = await Organization.findById(id);
  if (!organization) {
    return next(new ApiError("No organization found for this id", 404));
  }

  const isCreator = organization.organizationMembers.some(
    (member) =>
      member.email === req.user.email && member.accessLevel === "creator"
  );

  if (!isCreator) {
    return next(
      new ApiError("Only the creator of the organization can grant access", 403)
    );
  }

  // Update organization details
  organization.name = name || organization.name;
  organization.description = description || organization.description;
  organization.slug = slugify(name || organization.name);
  await organization.save();

  res.status(200).json({
    organization_id: organization._id,
    name: organization.name,
    description: organization.description,
  });
});

exports.deleteOrganization = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const organization = await Organization.findById(id);

  if (!organization) {
    return next(new ApiError("No organization found for this id", 404));
  }

  const isCreator = organization.organizationMembers.some(
    (member) =>
      member.email === req.user.email && member.accessLevel === "creator"
  );

  if (!isCreator) {
    return next(
      new ApiError("Only the creator of the organization can grant access", 403)
    );
  }
  await Organization.findByIdAndDelete(id);

  res.status(200).json({ message: "Organization deleted successfully" });
});

// @desc Grant access to another user for an organization
// @route POST /api/v1/organizations/:id/grant-access
// @access Private
exports.grantAccess = asyncHandler(async (req, res, next) => {
  const orgId = req.params.id;
  const { accessLevel, name } = req.body;
  userEmail = req.body.user_email;
  // Find the organization
  const organization = await Organization.findById(orgId);
  if (!organization) {
    return next(new ApiError("Organization not found", 404));
  }

  // Check if the requesting user has a "creator" role
  const isCreator = organization.organizationMembers.some(
    (member) =>
      member.email === req.user.email && member.accessLevel === "creator"
  );

  if (!isCreator) {
    return next(
      new ApiError("Only the creator of the organization can grant access", 403)
    );
  }

  // Check if the invited email exists in the user database
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    return next(
      new ApiError("The user with the provided email does not exist", 404)
    );
  }

  // Check if the user is already a member
  const existingMember = organization.organizationMembers.find(
    (member) => member.email === userEmail
  );
  if (existingMember) {
    return next(
      new ApiError("User already has access to this organization", 400)
    );
  }

  // Add the new member to the organization
  organization.organizationMembers.push({
    name: user.name, // Use the user's name from the database for accuracy
    email: userEmail,
    accessLevel,
  });

  await organization.save();

  res.status(200).json({
    message: "User has been invited",
  });
});
