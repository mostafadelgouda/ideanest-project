const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Organization name required"],
      minlength: [3, "Organization name is too short"],
      maxlength: [32, "Organization name is too long"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Organization description required"],
      minlength: [3, "Organization description is too short"],
    },
    organizationMembers: [
      {
        name: String,
        email: String,
        accessLevel: String,
      },
    ],
  },
  { timestamps: true }
);
const OrganizationModel = mongoose.model("organization", organizationSchema);

module.exports = OrganizationModel;
