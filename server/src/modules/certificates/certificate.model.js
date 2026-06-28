import mongoose from "mongoose";
import slugify from "slugify";
import validator from "validator";

const optionalUrl = {
  validator: (value) => !value || validator.isURL(value, { require_protocol: true }),
  message: "Please provide a valid URL with protocol",
};

const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    issuer: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    issuedAt: Date,
    credentialId: {
      type: String,
      trim: true,
      default: "",
    },
    credentialUrl: {
      type: String,
      trim: true,
      validate: optionalUrl,
    },
    image: String,
    skills: [String],
    order: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

certificateSchema.pre("validate", function setSlug() {
  if (!this.slug && this.title) {
    this.slug = slugify(`${this.title} ${this.issuer}`, { lower: true, strict: true });
  }
});

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;
