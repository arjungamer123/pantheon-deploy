import { setTimeout } from "node:timers/promises";

// Ensure config path
if (!process.env.PAPERCLIP_CONFIG) {
  const { resolve } = await import("node:path");
  process.env.PAPERCLIP_CONFIG = resolve(process.cwd(), "paperclip.json");
}

console.log("[pantheon] Config:", process.env.PAPERCLIP_CONFIG);
console.log("[pantheon] DATABASE_URL:", process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^@]+@/, ":***@") : "NOT SET");
console.log("[pantheon] PORT:", process.env.PORT);

// Retry loop — wait for Postgres
const MAX_RETRIES = 15;
for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
  try {
    console.log(`[pantheon] Starting server (attempt ${attempt}/${MAX_RETRIES})...`);
    const { startServer } = await import("@paperclipai/server");
    const server = await startServer();
    console.log("[pantheon] Server started successfully:", JSON.stringify(server));
    break;
  } catch (err) {
    const isConnectionError = err?.code === "ECONNREFUSED" || 
      String(err).includes("ECONNREFUSED") ||
      String(err).includes("connection refused") ||
      String(err).includes("ENOTFOUND");
    
    if (isConnectionError && attempt < MAX_RETRIES) {
      console.log(`[pantheon] Postgres not ready, retrying in ${attempt * 2}s...`);
      await setTimeout(attempt * 2000);
      continue;
    }
    
    console.error("[pantheon] Fatal error:", err);
    process.exit(1);
  }
}
