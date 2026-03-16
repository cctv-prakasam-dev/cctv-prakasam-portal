import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import type { Context } from "hono";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { DEF_ERROR_RESP } from "./constants/appMessages.js";
import envData from "./env.js";
import { syncYouTubeVideos } from "./modules/youtube/youtube.service.js";
import routes from "./routes.js";

const app = new Hono();

const port = envData.PORT || 3000;

app.use(logger());
app.use("*", cors({
  origin: [envData.APP_BASE_URL, `http://localhost:${envData.PORT}`, "http://localhost:5173"],
  credentials: true,
}));

// API routes
app.route("/api", routes);

app.onError((err: any, c: Context) => {
  const statusCode = err.status || 500;
  const errorMessage = err.message || DEF_ERROR_RESP;

  console.error("index", err);

  c.status(statusCode);
  return c.json({
    status: statusCode,
    success: false,
    message: errorMessage,
    name: err.name,
    errData: err.errData || undefined,
  });
});

// Serve frontend static files
app.use("/*", serveStatic({ root: "./web/dist" }));

// SPA fallback — serve index.html for non-API routes
app.get("/*", serveStatic({ root: "./web/dist", path: "index.html" }));

console.log(`🚀 Server is running on port ${port} in ${envData.NODE_ENV} mode`);

// Auto-sync YouTube videos every 30 minutes
const SYNC_INTERVAL_MS = 30 * 60 * 1000;
let isSyncing = false;

async function autoSync() {
  if (isSyncing)
    return;
  isSyncing = true;
  try {
    const result = await syncYouTubeVideos();
    console.log(`[Auto-Sync] YouTube sync completed: ${result.newVideos} new, ${result.updatedVideos} updated, ${result.totalVideos} total`);
  }
  catch (err) {
    console.error("[Auto-Sync] YouTube sync failed:", err);
  }
  finally {
    isSyncing = false;
  }
}

// Run initial sync after 10 seconds, then every 30 minutes
setTimeout(autoSync, 10_000);
setInterval(autoSync, SYNC_INTERVAL_MS);

serve({
  fetch: app.fetch,
  port,
});
