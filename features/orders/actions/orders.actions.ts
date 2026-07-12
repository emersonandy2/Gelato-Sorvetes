"use server";

import { ordersService } from "../services/orders.service";
import { getAuthUser } from "@/lib/auth";
import type { CreateOrderInput } from "../types/orders.types";

export async function createOrderAction(input: CreateOrderInput) {
  const user = await getAuthUser();
  if (!user) {
    return {
      success: false,
      message: "Você precisa estar autenticado para fazer um pedido",
    };
  }

  try {
    const result = await ordersService.createOrder(user.userId, input);
    return result;
  } catch {
    return {
      success: false,
      message: "Erro ao criar pedido. Tente novamente.",
    };
  }
}

export async function getUserOrdersAction(page?: number) {
  const user = await getAuthUser();
  if (!user) {
    return {
      success: false,
      message: "Não autenticado",
    };
  }

  try {
    const result = await ordersService.getUserOrders(user.userId, page);
    return { success: true, ...result };
  } catch {
    return {
      success: false,
      message: "Erro ao buscar pedidos",
    };
  }
}

export async function getOrderByIdAction(id: string) {
  const user = await getAuthUser();
  if (!user) {
    return {
      success: false,
      message: "Não autenticado",
    };
  }

  const order = await ordersService.getOrderById(id, user.userId);
  return order;
}

export async function validateCouponAction(code: string, orderTotal: number) {
  return ordersService.validateCoupon(code, orderTotal);
}

export async function calculateDeliveryFeeAction(neighborhood?: string) {
  return ordersService.calculateDeliveryFee(neighborhood);
}
