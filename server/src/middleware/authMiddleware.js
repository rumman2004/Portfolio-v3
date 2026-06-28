import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import Admin from "../modules/admin/admin.model.js";

export const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    const token = req.cookies?.adminToken || bearerToken;

    if (!token) {
      res.status(401);
      throw new Error("Authentication required");
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin || !admin.isActive) {
      res.status(401);
      throw new Error("Invalid admin session");
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(401);
    }
    next(error);
  }
};
