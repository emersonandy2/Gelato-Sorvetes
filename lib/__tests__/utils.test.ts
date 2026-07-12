import { describe, it, expect } from "vitest";
import { cn, formatCurrency, slugify, generateOTP, formatPhone, formatZipCode } from "../utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });
});

describe("formatCurrency", () => {
  it("formats BRL currency", () => {
    const result = formatCurrency(10.5);
    expect(result).toContain("10");
    expect(result).toContain("50");
  });

  it("handles zero", () => {
    const result = formatCurrency(0);
    expect(result).toContain("0");
  });
});

describe("slugify", () => {
  it("creates slug from text", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("handles special characters", () => {
    expect(slugify("Sorvete de Morango!")).toBe("sorvete-de-morango");
  });

  it("removes accents", () => {
    expect(slugify("Açaí")).toBe("acai");
  });
});

describe("generateOTP", () => {
  it("generates 6-digit code by default", () => {
    const otp = generateOTP();
    expect(otp).toHaveLength(6);
    expect(/^\d{6}$/.test(otp)).toBe(true);
  });

  it("generates custom length code", () => {
    const otp = generateOTP(4);
    expect(otp).toHaveLength(4);
  });

  it("generates different codes", () => {
    const codes = new Set(Array.from({ length: 100 }, () => generateOTP()));
    expect(codes.size).toBeGreaterThan(1);
  });
});

describe("formatPhone", () => {
  it("formats 11-digit phone", () => {
    expect(formatPhone("11999999999")).toBe("(11) 99999-9999");
  });

  it("formats 10-digit phone", () => {
    expect(formatPhone("1199999999")).toBe("(11) 9999-9999");
  });
});

describe("formatZipCode", () => {
  it("formats 8-digit zip code", () => {
    expect(formatZipCode("01234567")).toBe("01234-567");
  });
});
