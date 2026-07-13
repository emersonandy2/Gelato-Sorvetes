"use server";

import { adminService } from "../services/admin.service";
import { productService } from "@/features/products/services/product.service";
import { categoryService } from "@/features/categories/services/category.service";
import { requireAdmin } from "@/lib/auth";
import { adminLoginSchema, createProductSchema, updateProductSchema, createCategorySchema, updateCategorySchema, createCouponSchema, updateStoreSettingsSchema } from "@/lib/validation/admin.schema";
import { rateLimit } from "@/lib/rate-limit";

// Auth
export async function adminLoginAction(email: string, password: string) {
  // Rate limit: 5 login attempts per 15 minutes per email
  const { allowed } = rateLimit(`admin-login:${email}`, 5, 15 * 60 * 1000);
  if (!allowed) {
    return { success: false, message: "Muitas tentativas. Aguarde 15 minutos." };
  }

  const validated = adminLoginSchema.parse({ email, password });
  return adminService.login(validated.email, validated.password);
}

// Dashboard
export async function getDashboardStatsAction() {
  await requireAdmin();
  return adminService.getDashboardStats();
}

// Products
export async function getAllProductsAction(page?: number) {
  await requireAdmin();
  return adminService.getAllProducts(page);
}

export async function getProductByIdAction(id: string) {
  await requireAdmin();
  return productService.getProductById(id);
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  return productService.deleteProduct(id);
}

export async function updateProductAction(
  id: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    size?: string;
    ingredients?: string;
    categoryId?: string;
    available?: boolean;
    featured?: boolean;
    promotion?: boolean;
  }
) {
  await requireAdmin();
  const validated = updateProductSchema.parse(data);
  return productService.updateProduct(id, validated);
}

export async function createProductAction(data: {
  name: string;
  slug?: string;
  description?: string;
  price: number;
  size?: string;
  ingredients?: string;
  preparationTime?: number;
  stock?: number;
  available?: boolean;
  featured?: boolean;
  promotion?: boolean;
  categoryId: string;
  images?: { url: string; alt?: string }[];
  customizations?: { name: string; price: number }[];
}) {
  await requireAdmin();
  const validated = createProductSchema.parse(data);
  return productService.createProduct(validated as Parameters<typeof productService.createProduct>[0]);
}

// Categories
export async function getAllCategoriesAction() {
  await requireAdmin();
  return adminService.getAllCategories();
}

export async function createCategoryAction(data: { name: string; slug?: string; icon?: string; image?: string; sortOrder?: number }) {
  await requireAdmin();
  const validated = createCategorySchema.parse(data);
  return categoryService.createCategory(validated);
}

export async function updateCategoryAction(
  id: string,
  data: { name?: string; slug?: string; icon?: string; image?: string; sortOrder?: number; active?: boolean }
) {
  await requireAdmin();
  const validated = updateCategorySchema.parse(data);
  return categoryService.updateCategory(id, validated);
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  return categoryService.deleteCategory(id);
}

// Orders
export async function getAllOrdersAction(page?: number) {
  await requireAdmin();
  return adminService.getAllOrders(page);
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  await requireAdmin();
  return adminService.updateOrderStatus(orderId, status);
}

// Coupons
export async function getAllCouponsAction(page?: number) {
  await requireAdmin();
  return adminService.getAllCoupons(page);
}

export async function createCouponAction(data: {
  code: string;
  discount: number;
  type?: string;
  minOrder?: number;
  maxUses?: number;
  startDate: Date;
  endDate: Date;
}) {
  await requireAdmin();
  const validated = createCouponSchema.parse(data);
  return adminService.createCoupon(validated as Parameters<typeof adminService.createCoupon>[0]);
}

export async function updateCouponAction(
  id: string,
  data: {
    code?: string;
    discount?: number;
    type?: string;
    minOrder?: number;
    maxUses?: number;
    startDate?: Date;
    endDate?: Date;
    active?: boolean;
  }
) {
  await requireAdmin();
  return adminService.updateCoupon(id, data);
}

export async function deleteCouponAction(id: string) {
  await requireAdmin();
  return adminService.deleteCoupon(id);
}

// Banners
export async function getAllBannersAction() {
  await requireAdmin();
  return adminService.getAllBanners();
}

export async function createBannerAction(data: {
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  sortOrder?: number;
}) {
  await requireAdmin();
  return adminService.createBanner(data);
}

export async function updateBannerAction(
  id: string,
  data: {
    title?: string;
    subtitle?: string;
    image?: string;
    link?: string;
    active?: boolean;
    sortOrder?: number;
  }
) {
  await requireAdmin();
  return adminService.updateBanner(id, data);
}

export async function deleteBannerAction(id: string) {
  await requireAdmin();
  return adminService.deleteBanner(id);
}

// Settings
export async function getStoreSettingsAction() {
  await requireAdmin();
  return adminService.getStoreSettings();
}

export async function updateStoreSettingsAction(data: Record<string, string>) {
  await requireAdmin();
  const validated = updateStoreSettingsSchema.parse(data);
  return adminService.updateStoreSettings(validated);
}
