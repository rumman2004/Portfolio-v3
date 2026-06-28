import mongoose from "mongoose";
import slugify from "slugify";
import validator from "validator";

const optionalUrl = {
  validator: (value) => !value || validator.isURL(value, { require_protocol: true }),
  message: "Please provide a valid URL with protocol",
};

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      trim: true,
      default: "Web App",
    },
    shortDescription: {
      type: String,
      trim: true,
      required: true,
      maxlength: 320,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    heroImage: String,
    gallery: [String],
    techStack: [String],
    role: { type: String, trim: true, default: "" },
    timeline: { type: String, trim: true, default: "" },
    liveUrl: {
      type: String,
      trim: true,
      validate: optionalUrl,
    },
    githubUrl: {
      type: String,
      trim: true,
      validate: optionalUrl,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    problem: {
      type: String,
      trim: true,
      default: "",
    },
    solution: {
      type: String,
      trim: true,
      default: "",
    },
    results: {
      type: String,
      trim: true,
      default: "",
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

projectSchema.pre("validate", function setSlug() {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
