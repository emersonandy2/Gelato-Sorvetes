import { describe, it, expect, vi, beforeEach } from "vitest";
import { ordersService } from "../services/orders.service";

// Mock the repository
vi.mock("../repositories/orders.repository", () => ({
  ordersRepository: {
    validateStock: vi.fn().mockResolvedValue({ valid: true, issues: [] }),
    getDefaultDeliveryFee: vi.fn().mockResolvedValue(5),
    getDeliveryFee: vi.fn().mockResolvedValue(null),
    findActiveCoupon: vi.fn().mockResolvedValue(null),
    createOrder: vi.fn().mockResolvedValue({ id: "order-1" }),
    getOrdersByUserId: vi.fn().mockResolvedValue({
      orders: [],
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 0,
    }),
    getOrderById: vi.fn().mockResolvedValue(null),
  },
}));

describe("OrdersService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createOrder", () => {
    const validInput = {
      fullName: "João Silva",
      phone: "11999999999",
      zipCode: "01234567",
      street: "Rua Example",
      number: "123",
      district: "Centro",
      city: "São Paulo",
      paymentMethod: "pix" as const,
      cartItems: [
        { productId: "prod-1", quantity: 2, unitPrice: 15.99 },
      ],
    };

    it("creates order successfully", async () => {
      const result = await ordersService.createOrder("user-1", validInput);
      expect(result.success).toBe(true);
      expect(result.orderId).toBeDefined();
    });

    it("fails when stock is insufficient", async () => {
      const { ordersRepository } = await import("../repositories/orders.repository");
      vi.mocked(ordersRepository.validateStock).mockResolvedValueOnce({
        valid: false,
        issues: ["Produto sem estoque"],
      });

      const result = await ordersService.createOrder("user-1", validInput);
      expect(result.success).toBe(false);
    });
  });

  describe("validateCoupon", () => {
    it("rejects invalid coupon", async () => {
      const result = await ordersService.validateCoupon("INVALID", 100);
      expect(result.valid).toBe(false);
    });
  });

  describe("calculateDeliveryFee", () => {
    it("returns default fee when no neighborhood", async () => {
      const fee = await ordersService.calculateDeliveryFee();
      expect(fee).toBe(5);
    });
  });
});
