import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/features/products/services/product.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await productService.getProductById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Produto não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao buscar produto." },
      { status: 500 }
    );
  }
}
