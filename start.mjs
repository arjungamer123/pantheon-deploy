import { startServer } from "@paperclipai/server";

// Ensure config path is set
if (!process.env.PAPERCLIP_CONFIG) {
  const { resolve } = await import("node:path");
  process.env.PAPERCLIP_CONFIG = resolve(process.cwd(), "paperclip.json");
}

console.log("[pantheon] Starting Paperclip server...");
console.log("[pantheon] Config:", process.env.PAPERCLIP_CONFIG);
console.log("[pantheon] DATABASE_URL:", process.env.DATABASE_URL ? "set" : "NOT SET");

try {
  const server = await startServer();
  console.log("[pantheon] Server started:", server);
} catch (err) {
  console.error("[pantheon] Failed to start:", err);
  process.exit(1);
}
