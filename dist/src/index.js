import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { appConfig } from "./config/appConfig";
import envData from "./env";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { DEF_ERROR_RESP } from "./constants/appMessages";
const apiVer = appConfig.version;
const app = new Hono().basePath(`/v${apiVer}`);
const port = envData.PORT || 3000;
app.use(logger());
serve({
    fetch: app.fetch,
    port,
});
app.use("*", cors());
app.get("/", (c) => {
    return c.text("Hello Hono!");
});
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
