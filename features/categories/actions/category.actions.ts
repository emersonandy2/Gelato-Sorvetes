"use server";

import { categoryService } from "../services/category.service";

export async function getCategoriesAction() {
  return categoryService.getCategories();
}

export async function getCategoryBySlugAction(slug: string) {
  return categoryService.getCategoryBySlug(slug);
}
