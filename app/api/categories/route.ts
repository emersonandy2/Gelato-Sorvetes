import { NextResponse } from "next/server";
import { categoryService } from "@/features/categories/services/category.service";

export async function GET() {
  try {
    const categories = await categoryService.getCategories();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao buscar categorias." },
      { status: 500 }
    );
  }
}
