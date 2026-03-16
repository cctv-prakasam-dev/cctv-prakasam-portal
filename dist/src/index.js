import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { DEF_ERROR_RESP } from "./constants/appMessages.js";
import envData from "./env.js";
import { apiRateLimiter, authRateLimiter } from "./middlewares/rateLimiter.js";
import securityHeaders from "./middlewares/securityHeaders.js";
import { syncYouTubeVideos } from "./modules/youtube/youtube.service.js";
import routes from "./routes.js";
const app = new Hono();
const port = envData.PORT || 3000;
const isProduction = envData.NODE_ENV === "production";
// Security headers
app.use("*", securityHeaders);
// Logger
app.use(logger());
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
app.onError((err, c) => {
    const statusCode = err.status || 500;
    const errorMessage = err.message || DEF_ERROR_RESP;
    if (isProduction) {
        console.error(`[Error] ${statusCode}: ${errorMessage}`);
    }
    else {
        console.error("index", err);
    }
    const response = {
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
console.log(`Server is running on port ${port} in ${envData.NODE_ENV} mode`);
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
const syncTimeout = setTimeout(autoSync, 10_000);
const syncInterval = setInterval(autoSync, SYNC_INTERVAL_MS);
const server = serve({
    fetch: app.fetch,
    port,
});
// Graceful shutdown
function gracefulShutdown(signal) {
    console.log(`${signal} received. Shutting down gracefully...`);
    clearTimeout(syncTimeout);
    clearInterval(syncInterval);
    server.close(() => {
        console.log("Server closed.");
        process.exit(0);
    });
    // Force exit after 10 seconds
    setTimeout(() => {
        console.error("Forced shutdown after timeout.");
        process.exit(1);
    }, 10_000);
}
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
