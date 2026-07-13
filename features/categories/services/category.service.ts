import { categoryRepository } from "../repositories/category.repository";

export class CategoryService {
  async getCategories() {
    return categoryRepository.findAll();
  }

  async getCategoryBySlug(slug: string) {
    return categoryRepository.findBySlug(slug);
  }

  async getCategoryById(id: string) {
    return categoryRepository.findById(id);
  }

  async createCategory(data: { name: string; slug?: string; icon?: string; image?: string; sortOrder?: number }) {
    return categoryRepository.create(data);
  }

  async updateCategory(
    id: string,
    data: { name?: string; slug?: string; icon?: string; image?: string; sortOrder?: number; active?: boolean }
  ) {
    return categoryRepository.update(id, data);
  }

  async deleteCategory(id: string) {
    return categoryRepository.delete(id);
  }
}

export const categoryService = new CategoryService();
