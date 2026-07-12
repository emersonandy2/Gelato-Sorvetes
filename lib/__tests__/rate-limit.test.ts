import { describe, it, expect } from "vitest";
import { rateLimit } from "../rate-limit";

describe("rateLimit", () => {
  it("allows requests within limit", () => {
    const result = rateLimit("test-limit", 3, 60000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("blocks requests over limit", () => {
    rateLimit("test-block", 2, 60000);
    rateLimit("test-block", 2, 60000);
    const result = rateLimit("test-block", 2, 60000);
    expect(result.allowed).toBe(false);
  });

  it("uses different keys independently", () => {
    rateLimit("key-a", 1, 60000);
    const result = rateLimit("key-b", 1, 60000);
    expect(result.allowed).toBe(true);
  });
});
