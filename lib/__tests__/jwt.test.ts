import { describe, it, expect } from "vitest";
import { signToken, verifyToken } from "../jwt";

describe("JWT", () => {
  const testPayload = { userId: "123", email: "test@test.com" };

  it("creates and verifies token", async () => {
    const token = await signToken(testPayload, 3600);
    const verified = await verifyToken(token);
    expect(verified).toEqual(expect.objectContaining(testPayload));
  });

  it("rejects invalid token", async () => {
    const result = await verifyToken("invalid-token");
    expect(result).toBeNull();
  });

  it("rejects expired token", async () => {
    const token = await signToken(testPayload, -1);
    const result = await verifyToken(token);
    expect(result).toBeNull();
  });
});
