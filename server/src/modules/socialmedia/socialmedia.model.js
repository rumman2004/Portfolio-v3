import mongoose from "mongoose";
import validator from "validator";

const socialMediaSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    label: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    url: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value) => validator.isURL(value, { require_protocol: true }),
        message: "Please provide a valid URL with protocol",
      },
    },
    icon: {
      type: String,
      trim: true,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const SocialMedia = mongoose.model("SocialMedia", socialMediaSchema);

export default SocialMedia;
