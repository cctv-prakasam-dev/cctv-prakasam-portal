import { createMiddleware } from "hono/factory";
const stores = new Map();
function getStore(name) {
    let store = stores.get(name);
    if (!store) {
        store = new Map();
        stores.set(name, store);
    }
    return store;
}
// Cleanup expired entries every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
setInterval(() => {
    const now = Date.now();
    for (const store of stores.values()) {
        for (const [key, entry] of store) {
            if (now > entry.resetAt) {
                store.delete(key);
            }
        }
    }
}, CLEANUP_INTERVAL_MS);
function getClientIp(c) {
    return c.req.header("x-forwarded-for")?.split(",")[0]?.trim()
        || c.req.header("x-real-ip")
        || "unknown";
}
function createRateLimiter(opts) {
    const { name, windowMs, max } = opts;
    return createMiddleware(async (c, next) => {
        const store = getStore(name);
        const key = getClientIp(c);
        const now = Date.now();
        let entry = store.get(key);
        if (!entry || now > entry.resetAt) {
            entry = { count: 0, resetAt: now + windowMs };
            store.set(key, entry);
        }
        entry.count++;
        c.header("X-RateLimit-Limit", String(max));
        c.header("X-RateLimit-Remaining", String(Math.max(0, max - entry.count)));
        c.header("X-RateLimit-Reset", String(Math.ceil(entry.resetAt / 1000)));
        if (entry.count > max) {
            c.status(429);
            return c.json({
                status: 429,
                success: false,
                message: "Too many requests. Please try again later.",
            });
        }
        await next();
    });
}
// Auth endpoints: 10 requests per 15 minutes
export const authRateLimiter = createRateLimiter({
    name: "auth",
    windowMs: 15 * 60 * 1000,
    max: 10,
});
// General API: 100 requests per minute
export const apiRateLimiter = createRateLimiter({
    name: "api",
    windowMs: 60 * 1000,
    max: 100,
});
