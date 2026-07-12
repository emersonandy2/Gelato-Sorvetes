import { ordersRepository } from "../repositories/orders.repository";
import type { CreateOrderInput } from "../types/orders.types";

export class OrdersService {
  async createOrder(userId: string, input: CreateOrderInput) {
    // Validate stock availability
    const stockValidation = await ordersRepository.validateStock(input.cartItems);
    if (!stockValidation.valid) {
      return {
        success: false,
        message: stockValidation.issues.join(", "),
      };
    }

    // Calculate subtotal
    const subtotal = input.cartItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    // Calculate delivery fee
    let deliveryFee = await ordersRepository.getDefaultDeliveryFee();
    if (input.neighborhood) {
      const neighborhoodFee = await ordersRepository.getDeliveryFee(input.neighborhood);
      if (neighborhoodFee !== null) {
        deliveryFee = neighborhoodFee;
      }
    }

    // Calculate coupon discount
    let discount = 0;
    if (input.couponCode) {
      const coupon = await ordersRepository.findActiveCoupon(input.couponCode);
      if (coupon) {
        if (coupon.minOrder && subtotal < Number(coupon.minOrder)) {
          return {
            success: false,
            message: `Pedido mínimo de R$ ${coupon.minOrder} para usar este cupom`,
          };
        }
        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
          return {
            success: false,
            message: "Este cupom atingiu o limite de uso",
          };
        }
        if (coupon.type === "percentage") {
          discount = subtotal * (Number(coupon.discount) / 100);
        } else {
          discount = Number(coupon.discount);
        }
      }
    }

    // Calculate total
    const total = subtotal + deliveryFee - discount;

    // Create order
    const order = await ordersRepository.createOrder(userId, input, total, deliveryFee);

    return {
      success: true,
      message: "Pedido criado com sucesso!",
      orderId: order.id,
      total,
    };
  }

  async getUserOrders(userId: string, page?: number) {
    return ordersRepository.getOrdersByUserId(userId, page);
  }

  async getOrderById(id: string, userId?: string) {
    return ordersRepository.getOrderById(id, userId);
  }

  async validateCoupon(code: string, orderTotal: number) {
    const coupon = await ordersRepository.findActiveCoupon(code);

    if (!coupon) {
      return {
        valid: false,
        message: "Cupom inválido ou expirado",
      };
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return {
        valid: false,
        message: "Este cupom atingiu o limite de uso",
      };
    }

    if (coupon.minOrder && orderTotal < Number(coupon.minOrder)) {
      return {
        valid: false,
        message: `Pedido mínimo de R$ ${coupon.minOrder} para usar este cupom`,
      };
    }

    let discount = 0;
    if (coupon.type === "percentage") {
      discount = orderTotal * (Number(coupon.discount) / 100);
    } else {
      discount = Number(coupon.discount);
    }

    return {
      valid: true,
      message: "Cupom aplicado com sucesso!",
      discount,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        discount: Number(coupon.discount),
      },
    };
  }

  async calculateDeliveryFee(neighborhood?: string) {
    if (neighborhood) {
      const fee = await ordersRepository.getDeliveryFee(neighborhood);
      if (fee !== null) {
        return fee;
      }
    }
    return ordersRepository.getDefaultDeliveryFee();
  }
}

export const ordersService = new OrdersService();
