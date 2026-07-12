"use client";

import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import type { CartItem } from "@/store/use-cart-store";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
}

export function OrderSummary({ items, subtotal, deliveryFee, discount, total }: OrderSummaryProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Resumo do Pedido</h3>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-3">
            <div className="relative w-14 h-14 rounded-md overflow-hidden bg-muted shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium line-clamp-1">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.quantity}x {formatCurrency(item.price)}
              </p>
            </div>
            <p className="text-sm font-medium">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t pt-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Taxa de Entrega</span>
          <span>{formatCurrency(deliveryFee)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Desconto</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total</span>
          <span className="text-primary">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
