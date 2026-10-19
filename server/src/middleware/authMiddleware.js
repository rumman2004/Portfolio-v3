import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import Admin from "../modules/admin/admin.model.js";
import { assertValidObjectId } from "../utils/mongo.js";

export const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    const token = req.cookies?.adminToken || bearerToken;

    if (!token) {
      const error = new Error("Authentication required");
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    assertValidObjectId(decoded?.id, "admin");

    if (decoded.role !== "admin") {
      const error = new Error("Invalid admin session");
      error.statusCode = 401;
      throw error;
    }

    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin || !admin.isActive) {
      const error = new Error("Invalid admin session");
      error.statusCode = 401;
      throw error;
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (!error.statusCode || error.statusCode === 400) {
      error.statusCode = 401;
    }
    next(error);
  }
};
