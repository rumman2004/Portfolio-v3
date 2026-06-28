import mongoose from "mongoose";
import slugify from "slugify";

const hackathonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    organization: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
    },
    projectTitle: {
      type: String,
      trim: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    technologies: [String],
    achievement: {
      type: String,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
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

hackathonSchema.pre("validate", function setSlug() {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

const Hackathon = mongoose.model("Hackathon", hackathonSchema);

export default Hackathon;
