import { prisma } from "@/lib/prisma";
import { serializeDecimal } from "@/lib/utils";

export class AdminRepository {
  async findAdminByEmail(email: string) {
    return prisma.adminUser.findUnique({
      where: { email },
    });
  }

  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalProducts,
      productsInPromotion,
      featuredProducts,
      todayOrders,
      lowStockProducts,
      revenueResult,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { promotion: true } }),
      prisma.product.count({ where: { featured: true } }),
      prisma.order.count({
        where: {
          createdAt: { gte: today },
        },
      }),
      prisma.product.count({
        where: {
          stock: { lte: 5 },
          available: true,
        },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: today },
        },
        _sum: { total: true },
      }),
    ]);

    return {
      totalProducts,
      productsInPromotion,
      featuredProducts,
      todayOrders,
      lowStockProducts,
      estimatedRevenue: Number(revenueResult._sum.total || 0),
    };
  }

  async getAllOrders(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        include: {
          items: { include: { product: true } },
          user: { select: { email: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count(),
    ]);

    return {
      orders: serializeDecimal(orders),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateOrderStatus(orderId: string, status: string) {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    return serializeDecimal(order);
  }

  async getAllProducts(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        include: {
          images: { take: 1 },
          category: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count(),
    ]);

    return {
      products: serializeDecimal(products),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllCategories() {
    return prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: "asc" },
    });
  }

  async getAllCoupons(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.coupon.count(),
    ]);

    return {
      coupons: serializeDecimal(coupons),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllBanners() {
    return prisma.banner.findMany({
      orderBy: { sortOrder: "asc" },
    });
  }

  async getStoreSettings() {
    const settings = await prisma.storeSettings.findMany();
    const settingsMap: Record<string, string> = {};
    for (const setting of settings) {
      settingsMap[setting.key] = setting.value;
    }
    return settingsMap;
  }

  async updateStoreSettings(data: Record<string, string>) {
    const updates = Object.entries(data).map(([key, value]) =>
      prisma.storeSettings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    );
    await Promise.all(updates);
  }

  async createCoupon(data: {
    code: string;
    discount: number;
    type?: string;
    minOrder?: number;
    maxUses?: number;
    startDate: Date;
    endDate: Date;
  }) {
    const coupon = await prisma.coupon.create({ data });
    return serializeDecimal(coupon);
  }

  async updateCoupon(
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
    const coupon = await prisma.coupon.update({ where: { id }, data });
    return serializeDecimal(coupon);
  }

  async deleteCoupon(id: string) {
    return prisma.coupon.delete({ where: { id } });
  }

  async createBanner(data: {
    title: string;
    subtitle?: string;
    image: string;
    link?: string;
    sortOrder?: number;
  }) {
    return prisma.banner.create({ data });
  }

  async updateBanner(
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
    return prisma.banner.update({ where: { id }, data });
  }

  async deleteBanner(id: string) {
    return prisma.banner.delete({ where: { id } });
  }
}

export const adminRepository = new AdminRepository();
