import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../products/route";

// Mock the product service
vi.mock("@/features/products/services/product.service", () => ({
  productService: {
    getProducts: vi.fn().mockResolvedValue({
      products: [],
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 0,
    }),
  },
}));

describe("Products API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns products with default params", async () => {
    const request = new NextRequest("http://localhost:3000/api/products");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("handles search query", async () => {
    const request = new NextRequest("http://localhost:3000/api/products?query=sorvete");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("handles category filter", async () => {
    const request = new NextRequest("http://localhost:3000/api/products?category=sorvete");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("handles price filters", async () => {
    const request = new NextRequest("http://localhost:3000/api/products?minPrice=10&maxPrice=50");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("handles sort parameter", async () => {
    const request = new NextRequest("http://localhost:3000/api/products?sort=price-asc");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("handles pagination", async () => {
    const request = new NextRequest("http://localhost:3000/api/products?page=2&limit=10");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
