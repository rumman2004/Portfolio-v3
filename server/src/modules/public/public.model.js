import mongoose from "mongoose";
import validator from "validator";

const linkSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, required: true },
    url: {
      type: String,
      trim: true,
      required: true,
      validate: {
        validator: (value) => validator.isURL(value, { require_protocol: true }),
        message: "Please provide a valid URL with protocol",
      },
    },
  },
  { _id: false }
);

const statSchema = new mongoose.Schema(
  {
    value: { type: String, trim: true, required: true },
    label: { type: String, trim: true, required: true },
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      default: "Rumman Ahmed",
    },
    role: {
      type: String,
      trim: true,
      required: true,
      default: "Creative Developer",
    },
    headline: {
      type: String,
      trim: true,
      required: true,
      default: "Building digital products with motion, clarity and character.",
    },
    shortBio: {
      type: String,
      trim: true,
      maxlength: 400,
      default:
        "Frontend-focused developer crafting immersive, responsive portfolio experiences and clean product interfaces.",
    },
    about: {
      type: String,
      trim: true,
      maxlength: 1600,
      default:
        "I combine clean frontend architecture with visual systems that feel intentional: generous spacing, sharp hierarchy, fluid interactions, and sections that guide visitors through the work.",
    },
    location: {
      type: String,
      trim: true,
      default: "India",
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => !value || validator.isEmail(value),
        message: "Please provide a valid email address",
      },
    },
    resumeUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (value) => !value || validator.isURL(value, { require_protocol: true }),
        message: "Please provide a valid resume URL with protocol",
      },
    },
    profileImage: String,
    heroImage: String,
    socialLinks: [linkSchema],
    stats: [statSchema],
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
