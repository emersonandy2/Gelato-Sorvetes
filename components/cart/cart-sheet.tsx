"use client";

import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCartStore } from "@/store/use-cart-store";
import { useUIStore } from "@/store/use-ui-store";
import { formatCurrency } from "@/lib/utils";

export function CartSheet() {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
  const { isCartOpen, setCartOpen } = useUIStore();

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrinho ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Seu carrinho está vazio</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium line-clamp-1">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(item.price)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        aria-label={`Diminuir quantidade de ${item.name}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center" aria-label={`Quantidade: ${item.quantity}`}>
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        aria-label={`Aumentar quantidade de ${item.name}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 ml-auto text-destructive"
                        onClick={() => removeItem(item.productId)}
                        aria-label={`Remover ${item.name} do carrinho`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(getTotal())}</span>
              </div>
              <Button className="w-full" size="lg" onClick={() => {
                setCartOpen(false);
                window.location.href = "/checkout";
              }}>
                Finalizar Pedido
              </Button>
              <Button variant="outline" className="w-full" onClick={clearCart}>
                Limpar Carrinho
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
