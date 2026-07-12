import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/features/products/services/product.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      query: searchParams.get("query") || undefined,
      category: searchParams.get("category") || undefined,
      featured: searchParams.get("featured") === "true" ? true : undefined,
      promotion: searchParams.get("promotion") === "true" ? true : undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      sort: (searchParams.get("sort") as "price-asc" | "price-desc" | "name-asc" | "name-desc" | "newest") || undefined,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 12,
    };

    const result = await productService.getProducts(filters);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao buscar produtos." },
      { status: 500 }
    );
  }
}
