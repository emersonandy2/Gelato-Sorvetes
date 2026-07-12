import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/features/categories/services/category.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await categoryService.getCategoryById(id);

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Categoria não encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao buscar categoria." },
      { status: 500 }
    );
  }
}
