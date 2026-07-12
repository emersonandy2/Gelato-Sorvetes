import bcrypt from "bcryptjs";
import { adminRepository } from "../repositories/admin.repository";
import { signToken, verifyToken, type TokenPayload } from "@/lib/jwt";

export class AdminService {
  async login(email: string, password: string) {
    const admin = await adminRepository.findAdminByEmail(email);

    if (!admin) {
      return { success: false, message: "Credenciais inválidas" };
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return { success: false, message: "Credenciais inválidas" };
    }

    const token = await signToken(
      {
        userId: admin.id,
        email: admin.email,
        role: admin.role,
      },
      24 * 60 * 60
    );

    return {
      success: true,
      message: "Login realizado com sucesso!",
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  }

  async verifyAdminToken(token: string) {
    const payload = await verifyToken<TokenPayload & { role: string }>(token);
    if (!payload || payload.role !== "admin") return null;
    return payload;
  }

  async getDashboardStats() {
    return adminRepository.getDashboardStats();
  }

  async getAllOrders(page?: number) {
    return adminRepository.getAllOrders(page);
  }

  async updateOrderStatus(orderId: string, status: string) {
    return adminRepository.updateOrderStatus(orderId, status);
  }

  async getAllProducts(page?: number) {
    return adminRepository.getAllProducts(page);
  }

  async getAllCategories() {
    return adminRepository.getAllCategories();
  }

  async getAllCoupons(page?: number) {
    return adminRepository.getAllCoupons(page);
  }

  async getAllBanners() {
    return adminRepository.getAllBanners();
  }

  async getStoreSettings() {
    return adminRepository.getStoreSettings();
  }

  async updateStoreSettings(data: Record<string, string>) {
    return adminRepository.updateStoreSettings(data);
  }

  async createCoupon(data: Parameters<typeof adminRepository.createCoupon>[0]) {
    return adminRepository.createCoupon(data);
  }

  async updateCoupon(id: string, data: Parameters<typeof adminRepository.updateCoupon>[1]) {
    return adminRepository.updateCoupon(id, data);
  }

  async deleteCoupon(id: string) {
    return adminRepository.deleteCoupon(id);
  }

  async createBanner(data: Parameters<typeof adminRepository.createBanner>[0]) {
    return adminRepository.createBanner(data);
  }

  async updateBanner(id: string, data: Parameters<typeof adminRepository.updateBanner>[1]) {
    return adminRepository.updateBanner(id, data);
  }

  async deleteBanner(id: string) {
    return adminRepository.deleteBanner(id);
  }
}

export const adminService = new AdminService();
