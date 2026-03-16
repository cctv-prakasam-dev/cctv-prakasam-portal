import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock envData before importing logger
vi.mock("../env.js", () => ({
  default: { NODE_ENV: "production" },
}));

describe("logger (production mode)", () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("should output structured JSON in production", async () => {
    const { default: logger } = await import("./logger.js");
    logger.error("test-ctx", "something failed", { code: 500 });

    expect(consoleSpy).toHaveBeenCalledOnce();
    const output = consoleSpy.mock.calls[0]![0] as string;
    const parsed = JSON.parse(output);

    expect(parsed.level).toBe("error");
    expect(parsed.context).toBe("test-ctx");
    expect(parsed.message).toBe("something failed");
    expect(parsed.meta).toEqual({ code: 500 });
    expect(parsed.timestamp).toBeDefined();
  });
});

describe("logger (development mode)", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.doMock("../env.js", () => ({
      default: { NODE_ENV: "development" },
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should output human-readable format in development", async () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { default: logger } = await import("./logger.js");
    logger.warn("auth", "token expired");

    expect(consoleSpy).toHaveBeenCalledOnce();
    const output = consoleSpy.mock.calls[0]![0] as string;
    expect(output).toContain("[WARN]");
    expect(output).toContain("[auth]");
    expect(output).toContain("token expired");
    consoleSpy.mockRestore();
  });
});
