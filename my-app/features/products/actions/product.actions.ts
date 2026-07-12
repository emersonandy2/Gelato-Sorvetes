"use server";

import { productService } from "../services/product.service";
import type { ProductFilters } from "../types/product.types";

export async function getProductsAction(filters: ProductFilters) {
  return productService.getProducts(filters);
}

export async function getProductBySlugAction(slug: string) {
  return productService.getProductBySlug(slug);
}

export async function getFeaturedProductsAction(limit?: number) {
  return productService.getFeaturedProducts(limit);
}

export async function getPromotionProductsAction(limit?: number) {
  return productService.getPromotionProducts(limit);
}

export async function getRelatedProductsAction(categoryId: string, productId: string, limit?: number) {
  return productService.getRelatedProducts(categoryId, productId, limit);
}
