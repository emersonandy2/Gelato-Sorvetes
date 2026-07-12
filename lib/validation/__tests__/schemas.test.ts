import { describe, it, expect } from "vitest";
import { emailSchema, otpSchema } from "../auth.schema";
import { checkoutSchema } from "../order.schema";
import { productSchema } from "../product.schema";

describe("Auth Schemas", () => {
  describe("emailSchema", () => {
    it("accepts valid email", () => {
      expect(emailSchema.safeParse({ email: "test@test.com" }).success).toBe(true);
    });

    it("rejects invalid email", () => {
      expect(emailSchema.safeParse({ email: "not-an-email" }).success).toBe(false);
    });
  });

  describe("otpSchema", () => {
    it("accepts valid OTP", () => {
      expect(otpSchema.safeParse({ email: "test@test.com", code: "123456" }).success).toBe(true);
    });

    it("rejects wrong length OTP", () => {
      expect(otpSchema.safeParse({ email: "test@test.com", code: "12345" }).success).toBe(false);
    });
  });
});

describe("Checkout Schema", () => {
  const validCheckout = {
    fullName: "João Silva",
    phone: "11999999999",
    zipCode: "01234567",
    street: "Rua Example",
    number: "123",
    district: "Centro",
    city: "São Paulo",
    paymentMethod: "pix" as const,
  };

  it("accepts valid checkout", () => {
    expect(checkoutSchema.safeParse(validCheckout).success).toBe(true);
  });

  it("rejects missing required fields", () => {
    expect(checkoutSchema.safeParse({}).success).toBe(false);
  });

  it("rejects invalid payment method", () => {
    expect(checkoutSchema.safeParse({ ...validCheckout, paymentMethod: "bitcoin" }).success).toBe(false);
  });
});

describe("Product Schema", () => {
  const validProduct = {
    name: "Sorvete de Morango",
    price: 15.99,
    stock: 10,
    categoryId: "cat-123",
    images: ["https://example.com/image.jpg"],
  };

  it("accepts valid product", () => {
    expect(productSchema.safeParse(validProduct).success).toBe(true);
  });

  it("rejects negative price", () => {
    expect(productSchema.safeParse({ ...validProduct, price: -5 }).success).toBe(false);
  });

  it("rejects empty images", () => {
    expect(productSchema.safeParse({ ...validProduct, images: [] }).success).toBe(false);
  });
});
