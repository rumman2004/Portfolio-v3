import app from "./app.js";
import { connectDB } from "./src/config/db.js";
import { env } from "./src/config/env.js";
import { bootstrapAdmin } from "./src/modules/admin/admin.services.js";

await connectDB();
const bootstrappedAdmin = await bootstrapAdmin();

if (bootstrappedAdmin) {
  console.log("Admin account created from environment variables.");
}

const server = app.listen(env.port, () => {
  console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
});

const shutdown = (signal) => {
  console.log(`${signal} received. Closing server...`);
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (error) => {
  console.error(`Unhandled rejection: ${error.message}`);
  server.close(() => process.exit(1));
});
