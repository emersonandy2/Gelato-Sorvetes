import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../categories/route";

// Mock the category service
vi.mock("@/features/categories/services/category.service", () => ({
  categoryService: {
    getCategories: vi.fn().mockResolvedValue([]),
  },
}));

describe("Categories API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns categories", async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });
});
