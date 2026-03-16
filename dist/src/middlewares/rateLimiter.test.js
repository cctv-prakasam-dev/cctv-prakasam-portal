import { describe, expect, it, vi } from "vitest";
// Mock env to avoid process.exit during tests
vi.mock("../env.js", () => ({
    default: { NODE_ENV: "test" },
}));
// Must import after mocks
const { MemoryStore } = await import("./rateLimiter.js");
describe("memoryStore", () => {
    it("should increment count for a key", async () => {
        const store = new MemoryStore();
        const result = await store.increment("test:127.0.0.1", 60_000);
        expect(result.count).toBe(1);
        expect(result.resetAt).toBeGreaterThan(Date.now() - 1000);
        store.destroy();
    });
    it("should track multiple increments within window", async () => {
        const store = new MemoryStore();
        await store.increment("test:127.0.0.1", 60_000);
        await store.increment("test:127.0.0.1", 60_000);
        const result = await store.increment("test:127.0.0.1", 60_000);
        expect(result.count).toBe(3);
        store.destroy();
    });
    it("should track different keys independently", async () => {
        const store = new MemoryStore();
        await store.increment("test:192.168.1.1", 60_000);
        await store.increment("test:192.168.1.1", 60_000);
        const result = await store.increment("test:10.0.0.1", 60_000);
        expect(result.count).toBe(1);
        store.destroy();
    });
    it("should reset after window expires", async () => {
        const store = new MemoryStore();
        // Use a 1ms window
        await store.increment("test:127.0.0.1", 1);
        // Wait for window to expire
        await new Promise(r => setTimeout(r, 10));
        const result = await store.increment("test:127.0.0.1", 1);
        expect(result.count).toBe(1);
        store.destroy();
    });
});
