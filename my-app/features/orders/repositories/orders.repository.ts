import { prisma } from "@/lib/prisma";
import { serializeDecimal } from "@/lib/utils";
import { PRODUCT_PAGE_SIZE } from "@/lib/constants";
import type { CreateOrderInput } from "../types/orders.types";

export class OrdersRepository {
  async createOrder(userId: string, input: CreateOrderInput, total: number, deliveryFee: number) {
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId,
          status: "pending",
          paymentMethod: input.paymentMethod,
          changeFor: input.changeFor,
          deliveryFee,
          total,
          notes: input.notes,
          fullName: input.fullName,
          phone: input.phone,
          zipCode: input.zipCode,
          street: input.street,
          number: input.number,
          district: input.district,
          city: input.city,
          complement: input.complement,
          neighborhood: input.neighborhood,
        },
      });

      // Create order items and decrement stock
      for (const item of input.cartItems) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          },
        });

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // If coupon was used, increment its usedCount
      if (input.couponCode) {
        await tx.coupon.update({
          where: { code: input.couponCode },
          data: {
            usedCount: {
              increment: 1,
            },
          },
        });
      }

      return newOrder;
    });

    return serializeDecimal(order);
  }

  async getOrdersByUserId(userId: string, page: number = 1, limit: number = PRODUCT_PAGE_SIZE) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: { product: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    return {
      orders: serializeDecimal(orders),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOrderById(id: string, userId?: string) {
    const where: Record<string, unknown> = { id };
    if (userId) {
      where.userId = userId;
    }

    const order = await prisma.order.findFirst({
      where,
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    return serializeDecimal(order);
  }

  async findActiveCoupon(code: string) {
    const coupon = await prisma.coupon.findFirst({
      where: {
        code,
        active: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
    });
    return serializeDecimal(coupon);
  }

  async getDeliveryFee(neighborhood: string) {
    const fee = await prisma.neighborhoodFee.findFirst({
      where: {
        name: {
          equals: neighborhood,
          mode: "insensitive",
        },
        deliveryArea: { active: true },
      },
    });

    return fee ? Number(fee.fee) : null;
  }

  async getDefaultDeliveryFee() {
    const setting = await prisma.storeSettings.findUnique({
      where: { key: "delivery_fee" },
    });

    return setting ? parseFloat(setting.value) : 0;
  }

  async validateStock(cartItems: { productId: string; quantity: number }[]) {
    const productIds = cartItems.map((item) => item.productId);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, stock: true, name: true, available: true },
    });

    const issues: string[] = [];

    for (const item of cartItems) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        issues.push(`Produto não encontrado`);
      } else if (!product.available) {
        issues.push(`${product.name} está indisponível`);
      } else if (product.stock < item.quantity) {
        issues.push(`${product.name} tem apenas ${product.stock} unidades em estoque`);
      }
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }
}

export const ordersRepository = new OrdersRepository();
