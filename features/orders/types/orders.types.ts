import type { Order, OrderItem, Product } from "../../../generated/prisma/client";

export type OrderWithItems = Order & {
  items: (OrderItem & { product: Product })[];
};

export interface CreateOrderInput {
  fullName: string;
  phone: string;
  zipCode: string;
  street: string;
  number: string;
  district: string;
  city: string;
  complement?: string;
  neighborhood?: string;
  paymentMethod: "cash" | "pix" | "credit_card" | "debit_card";
  changeFor?: number;
  notes?: string;
  couponCode?: string;
  cartItems: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface OrderSummary {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
}
