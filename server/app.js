import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { env, isProduction } from "./src/config/env.js";
import { errorHandler, notFound } from "./src/middleware/errorMiddleware.js";
import adminRoutes from "./src/modules/admin/admin.routes.js";
import publicRoutes from "./src/modules/public/public.routes.js";
import projectRoutes from "./src/modules/projects/project.routes.js";
import skillRoutes from "./src/modules/skills/skills.routes.js";
import contactRoutes from "./src/modules/contact/contact.routes.js";
import certificateRoutes from "./src/modules/certificates/certificate.routes.js";
import socialMediaRoutes from "./src/modules/socialmedia/socialmedia.routes.js";
import experienceRoutes from "./src/modules/Experience/experience.routes.js";
import hackathonRoutes from "./src/modules/hackathon/hackathon.routes.js";
import educationRoutes from "./src/modules/education/education.routes.js";
import notificationRoutes from "./src/modules/notifications/notifications.routes.js";

const app = express();
const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const clientDistDirectory = path.resolve(serverDirectory, "../client/dist");

app.set("trust proxy", 1);

app.locals.apiCallCount = 0;

app.use("/api", (req, res, next) => {
  req.app.locals.apiCallCount += 1;
  next();
});

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 500,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());

if (!isProduction) {
  app.use(morgan("dev"));
}

app.get("/favicon.png", (req, res) => res.status(204).end());
app.get("/favicon.ico", (req, res) => res.status(204).end());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Portfolio API is running",
    environment: env.nodeEnv,
  });
});

app.use("/api/admin", adminRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/social-media", socialMediaRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/hackathon", hackathonRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/notifications", notificationRoutes);

// The container build places the Vite output next to the API. Serving it here
// keeps the Docker deployment single-origin while leaving Vercel/API-only
// deployments unchanged when the directory is absent.
if (fs.existsSync(clientDistDirectory)) {
  app.use(express.static(clientDistDirectory));
  app.get("/", (req, res) => {
    res.sendFile(path.join(clientDistDirectory, "index.html"));
  });
  app.get(/^(?!\/api(?:\/|$)).*/, (req, res) => {
    res.sendFile(path.join(clientDistDirectory, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Portfolio API is running. Access endpoints at /api",
      environment: env.nodeEnv,
    });
  });
}

app.use(notFound);
app.use(errorHandler);

export default app;
