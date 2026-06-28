import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import Admin from "./admin.model.js";

const signToken = (adminId) =>
  jwt.sign({ id: adminId, role: "admin" }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

const sanitizeAdmin = (admin) => ({
  id: admin._id,
  name: admin.name,
  title: admin.title,
  bio: admin.bio,
  email: admin.email,
  role: admin.role,
  isActive: admin.isActive,
  lastLoginAt: admin.lastLoginAt,
  createdAt: admin.createdAt,
  updatedAt: admin.updatedAt,
});

export const bootstrapAdmin = async () => {
  const existingAdminCount = await Admin.countDocuments();

  if (existingAdminCount > 0 || !env.admin.email || !env.admin.password) {
    return null;
  }

  return Admin.create({
    name: "Admin",
    email: env.admin.email,
    password: env.admin.password,
  });
};

export const loginAdmin = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select("+password");

  if (!admin || !(await admin.matchPassword(password))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (!admin.isActive) {
    const error = new Error("Admin account is disabled");
    error.statusCode = 403;
    throw error;
  }

  admin.lastLoginAt = new Date();
  await admin.save({ validateBeforeSave: false });

  return {
    token: signToken(admin._id),
    admin: sanitizeAdmin(admin),
  };
};

export const getAdminProfile = (admin) => sanitizeAdmin(admin);

export const updateAdminProfile = async (adminId, data) => {
  const allowedUpdates = {
    name: data.name,
    title: data.title,
    bio: data.bio,
    email: data.email
  };
  
  const admin = await Admin.findByIdAndUpdate(adminId, allowedUpdates, { new: true, runValidators: true });
  
  if (!admin) {
    const error = new Error("Admin not found");
    error.statusCode = 404;
    throw error;
  }
  
  return sanitizeAdmin(admin);
};
