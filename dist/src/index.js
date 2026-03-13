import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { DEF_ERROR_RESP } from "./constants/appMessages.js";
import envData from "./env.js";
import routes from "./routes.js";
const app = new Hono();
const port = envData.PORT || 3000;
app.use(logger());
app.use("*", cors());
// API routes
app.route("/api", routes);
app.onError((err, c) => {
    const statusCode = err.status || 555;
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
serve({
    fetch: app.fetch,
    port,
});
