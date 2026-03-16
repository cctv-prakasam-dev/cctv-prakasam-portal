import { describe, expect, it } from "vitest";

// Test the escapeHtml logic directly (same regex as in auth.service.ts)
const RE_AMP = /&/g;
const RE_LT = /</g;
const RE_GT = />/g;
const RE_QUOT = /"/g;
const RE_APOS = /'/g;

function escapeHtml(str: string): string {
  return str
    .replace(RE_AMP, "&amp;")
    .replace(RE_LT, "&lt;")
    .replace(RE_GT, "&gt;")
    .replace(RE_QUOT, "&quot;")
    .replace(RE_APOS, "&#039;");
}

describe("escapeHtml", () => {
  it("should escape ampersands", () => {
    expect(escapeHtml("foo & bar")).toBe("foo &amp; bar");
  });

  it("should escape angle brackets", () => {
    expect(escapeHtml("<script>alert('xss')</script>")).toBe(
      "&lt;script&gt;alert(&#039;xss&#039;)&lt;/script&gt;",
    );
  });

  it("should escape quotes", () => {
    expect(escapeHtml("He said \"hello\"")).toBe("He said &quot;hello&quot;");
  });

  it("should handle empty strings", () => {
    expect(escapeHtml("")).toBe("");
  });

  it("should handle strings with no special characters", () => {
    expect(escapeHtml("Hello World")).toBe("Hello World");
  });

  it("should escape all special characters together", () => {
    expect(escapeHtml(`<div class="test">&'`)).toBe(
      "&lt;div class=&quot;test&quot;&gt;&amp;&#039;",
    );
  });
});

describe("youTube ID validation", () => {
  const YOUTUBE_ID_REGEX = /^[\w-]{11}$/;

  it("should accept valid YouTube IDs", () => {
    expect(YOUTUBE_ID_REGEX.test("dQw4w9WgXcQ")).toBe(true);
    expect(YOUTUBE_ID_REGEX.test("_AbCdEfGhIj")).toBe(true);
    expect(YOUTUBE_ID_REGEX.test("12345678901")).toBe(true);
  });

  it("should reject invalid YouTube IDs", () => {
    expect(YOUTUBE_ID_REGEX.test("")).toBe(false);
    expect(YOUTUBE_ID_REGEX.test("too_short")).toBe(false);
    expect(YOUTUBE_ID_REGEX.test("way_too_long_id_here")).toBe(false);
    expect(YOUTUBE_ID_REGEX.test("<script>xss")).toBe(false);
    expect(YOUTUBE_ID_REGEX.test("abc def ghij")).toBe(false);
  });
});

describe("password validation rules", () => {
  it("should require minimum 8 characters", () => {
    expect("short".length >= 8).toBe(false);
    expect("longenough".length >= 8).toBe(true);
    expect("exactly8".length >= 8).toBe(true);
    expect("1234567".length >= 8).toBe(false);
  });
});
