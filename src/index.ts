import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import type { Context } from "hono";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger as honoLogger } from "hono/logger";

import { DEF_ERROR_RESP } from "./constants/appMessages.js";
import envData from "./env.js";
import { apiRateLimiter, authRateLimiter } from "./middlewares/rateLimiter.js";
import securityHeaders from "./middlewares/securityHeaders.js";
import { syncYouTubeVideos } from "./modules/youtube/youtube.service.js";
import routes from "./routes.js";
import logger from "./utils/logger.js";

const app = new Hono();

const port = envData.PORT || 3000;
const isProduction = envData.NODE_ENV === "production";

// Security headers
app.use("*", securityHeaders);

// Logger
app.use(honoLogger());

// CORS — only allow APP_BASE_URL in production
const allowedOrigins = isProduction
  ? [envData.APP_BASE_URL]
  : [envData.APP_BASE_URL, `http://localhost:${envData.PORT}`, "http://localhost:5173"];

app.use("*", cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Rate limiting
app.use("/api/auth/*", authRateLimiter);
app.use("/api/*", apiRateLimiter);

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", uptime: process.uptime() });
});

// API routes
app.route("/api", routes);

app.onError((err: any, c: Context) => {
  const statusCode = err.status || 500;
  const errorMessage = err.message || DEF_ERROR_RESP;

  if (isProduction) {
    logger.error("http", errorMessage, { status: statusCode });
  }
  else {
    logger.error("http", errorMessage, { status: statusCode, name: err.name, stack: err.stack });
  }

  const response: Record<string, unknown> = {
    status: statusCode,
    success: false,
    message: errorMessage,
  };

  // Only expose error details in development
  if (!isProduction) {
    response.name = err.name;
    response.errData = err.errData || undefined;
  }

  c.status(statusCode);
  return c.json(response);
});

// Serve frontend static files
app.use("/*", serveStatic({ root: "./web/dist" }));

// SPA fallback — serve index.html for non-API routes
app.get("/*", serveStatic({ root: "./web/dist", path: "index.html" }));

logger.info("server", `Server is running on port ${port} in ${envData.NODE_ENV} mode`);

// Auto-sync YouTube videos every 30 minutes
const SYNC_INTERVAL_MS = 30 * 60 * 1000;
let isSyncing = false;

async function autoSync() {
  if (isSyncing)
    return;
  isSyncing = true;
  try {
    const result = await syncYouTubeVideos();
    logger.info("auto-sync", "YouTube sync completed", { newVideos: result.newVideos, updatedVideos: result.updatedVideos, totalVideos: result.totalVideos });
  }
  catch (err) {
    logger.error("auto-sync", "YouTube sync failed", { error: String(err) });
  }
  finally {
    isSyncing = false;
  }
}

// Run initial sync after 10 seconds, then every 30 minutes
const syncTimeout = setTimeout(autoSync, 10_000);
const syncInterval = setInterval(autoSync, SYNC_INTERVAL_MS);

const server = serve({
  fetch: app.fetch,
  port,
});

// Graceful shutdown
function gracefulShutdown(signal: string) {
  logger.info("server", `${signal} received. Shutting down gracefully...`);
  clearTimeout(syncTimeout);
  clearInterval(syncInterval);
  server.close(() => {
    logger.info("server", "Server closed.");
    process.exit(0);
  });
  // Force exit after 10 seconds
  setTimeout(() => {
    logger.error("server", "Forced shutdown after timeout.");
    process.exit(1);
  }, 10_000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
