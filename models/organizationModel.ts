import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the organization schema
interface IOrganizationMember {
  name: string;
  email: string;
  accessLevel: string;
}

interface IOrganization extends Document {
  name: string;
  slug?: string;
  description: string;
  organizationMembers: IOrganizationMember[];
}

// Define the organization schema
const organizationSchema: Schema<IOrganization> = new mongoose.Schema(
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
        name: { type: String, required: true },
        email: { type: String, required: true },
        accessLevel: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const OrganizationModel = mongoose.model<IOrganization>("Organization", organizationSchema);

export default OrganizationModel;
