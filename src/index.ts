import { readFileSync } from "node:fs";
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

// Dynamic OG meta for video pages (social media crawlers)
const indexHtml = readFileSync("./web/dist/index.html", "utf-8");

app.get("/videos/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const resp = await fetch(`http://localhost:${port}/api/videos/${id}`);
    if (resp.ok) {
      const json = await resp.json() as { data?: { title?: string; title_te?: string; description?: string; thumbnail_url?: string } };
      const video = json.data;
      if (video) {
        const title = (video.title_te || video.title || "Video") + " — CCTV AP Prakasam";
        const desc = video.description?.slice(0, 160) || "Watch on CCTV AP Prakasam";
        const image = video.thumbnail_url || `${envData.APP_BASE_URL}/og-image.png`;
        const url = `${envData.APP_BASE_URL}/videos/${id}`;

        const html = indexHtml
          .replace(/<title>.*?<\/title>/, `<title>${title.replace(/</g, "&lt;")}</title>`)
          .replace(/property="og:title" content="[^"]*"/, `property="og:title" content="${title.replace(/"/g, "&quot;")}"`)
          .replace(/property="og:description" content="[^"]*"/, `property="og:description" content="${desc.replace(/"/g, "&quot;")}"`)
          .replace(/property="og:image" content="[^"]*"/, `property="og:image" content="${image}"`)
          .replace(/property="og:url" content="[^"]*"/, `property="og:url" content="${url}"`)
          .replace(/name="twitter:title" content="[^"]*"/, `name="twitter:title" content="${title.replace(/"/g, "&quot;")}"`)
          .replace(/name="twitter:description" content="[^"]*"/, `name="twitter:description" content="${desc.replace(/"/g, "&quot;")}"`)
          .replace(/name="twitter:image" content="[^"]*"/, `name="twitter:image" content="${image}"`)
          .replace(/name="description" content="[^"]*"/, `name="description" content="${desc.replace(/"/g, "&quot;")}"`);

        return c.html(html);
      }
    }
  }
  catch {
    // Fall through to serve default index.html
  }
  return c.html(indexHtml);
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
