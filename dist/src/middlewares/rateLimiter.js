import { createMiddleware } from "hono/factory";
import logger from "../utils/logger.js";
// In-memory store (single-process; production-ready for single-instance deployments)
class MemoryStore {
    entries = new Map();
    cleanupTimer;
    constructor() {
        // Cleanup expired entries every 60 seconds
        this.cleanupTimer = setInterval(() => {
            const now = Date.now();
            for (const [key, entry] of this.entries) {
                if (now > entry.resetAt) {
                    this.entries.delete(key);
                }
            }
        }, 60_000);
        // Don't keep process alive just for cleanup
        if (this.cleanupTimer.unref) {
            this.cleanupTimer.unref();
        }
    }
    async increment(key, windowMs) {
        const now = Date.now();
        let entry = this.entries.get(key);
        if (!entry || now > entry.resetAt) {
            entry = { count: 0, resetAt: now + windowMs };
            this.entries.set(key, entry);
        }
        entry.count++;
        return { count: entry.count, resetAt: entry.resetAt };
    }
    destroy() {
        clearInterval(this.cleanupTimer);
        this.entries.clear();
    }
}
function getClientIp(c) {
    return c.req.header("x-forwarded-for")?.split(",")[0]?.trim()
        || c.req.header("x-real-ip")
        || "unknown";
}
function createRateLimiter(opts) {
    const { name, windowMs, max, store = new MemoryStore() } = opts;
    logger.info("rate-limiter", `Initialized "${name}" rate limiter`, { windowMs, max, storeType: store.constructor.name });
    return createMiddleware(async (c, next) => {
        const key = `${name}:${getClientIp(c)}`;
        const { count, resetAt } = await store.increment(key, windowMs);
        c.header("X-RateLimit-Limit", String(max));
        c.header("X-RateLimit-Remaining", String(Math.max(0, max - count)));
        c.header("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
        if (count > max) {
            logger.warn("rate-limiter", `Rate limit exceeded for ${name}`, { ip: getClientIp(c), count });
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
export { createRateLimiter, MemoryStore };
