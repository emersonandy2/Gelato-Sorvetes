import { productRepository } from "../repositories/product.repository";
import type { ProductFilters, PaginatedProducts } from "../types/product.types";

export class ProductService {
  async getProducts(filters: ProductFilters): Promise<PaginatedProducts> {
    return productRepository.findMany(filters);
  }

  async getProductBySlug(slug: string) {
    return productRepository.findBySlug(slug);
  }

  async getProductById(id: string) {
    return productRepository.findById(id);
  }

  async getFeaturedProducts(limit?: number) {
    return productRepository.findFeatured(limit);
  }

  async getPromotionProducts(limit?: number) {
    return productRepository.findOnPromotion(limit);
  }

  async getRelatedProducts(categoryId: string, productId: string, limit?: number) {
    return productRepository.findRelated(categoryId, productId, limit);
  }

  async createProduct(data: Parameters<typeof productRepository.create>[0]) {
    return productRepository.create(data);
  }

  async updateProduct(id: string, data: Parameters<typeof productRepository.update>[1]) {
    return productRepository.update(id, data);
  }

  async deleteProduct(id: string) {
    return productRepository.delete(id);
  }

  async getLowStockProducts(threshold?: number) {
    return productRepository.getLowStockProducts(threshold);
  }
}

export const productService = new ProductService();
