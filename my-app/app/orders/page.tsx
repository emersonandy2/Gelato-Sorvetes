"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, ChevronDown, ChevronUp } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserOrdersAction } from "@/features/orders/actions/orders.actions";
import { useAuthStore } from "@/store/use-auth-store";
import { formatCurrency } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { Pagination } from "@/components/shared/pagination";
import type { OrderWithItems } from "@/features/orders/types/orders.types";

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadOrders() {
      setIsLoading(true);
      const result = await getUserOrdersAction(currentPage);
      if (result.success && "orders" in result) {
        setOrders(result.orders as unknown as OrderWithItems[]);
        setTotalPages(result.totalPages);
      }
      setIsLoading(false);
    }

    loadOrders();
  }, [isAuthenticated, currentPage]);

  function getStatusColor(status: string) {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-purple-100 text-purple-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Package className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Meus Pedidos</h1>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Você ainda não fez nenhum pedido</p>
            <Button onClick={() => router.push("/catalog")}>Ver Cardápio</Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() =>
                        setExpandedOrder(expandedOrder === order.id ? null : order.id)
                      }
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-mono text-sm text-muted-foreground">
                            #{order.id.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {ORDER_STATUS_LABELS[order.status] || order.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(Number(order.total))}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} {order.items.length === 1 ? "item" : "itens"}
                          </p>
                        </div>
                        {expandedOrder === order.id ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {expandedOrder === order.id && (
                      <div className="mt-4 pt-4 border-t space-y-3">
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>
                                {item.product.name} x{item.quantity}
                              </span>
                              <span>
                                {formatCurrency(Number(item.unitPrice) * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t pt-2 flex justify-between text-sm">
                          <span className="text-muted-foreground">Taxa de Entrega</span>
                          <span>{formatCurrency(Number(order.deliveryFee))}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>{formatCurrency(Number(order.total))}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>
                            <strong>Pagamento:</strong>{" "}
                            {order.paymentMethod === "pix"
                              ? "PIX"
                              : order.paymentMethod === "cash"
                                ? "Dinheiro"
                                : order.paymentMethod === "credit_card"
                                  ? "Cartão de Crédito"
                                  : "Cartão de Débito"}
                          </p>
                          <p>
                            <strong>Endereço:</strong> {order.street}, {order.number} -{" "}
                            {order.district}, {order.city}
                          </p>
                          {order.notes && (
                            <p>
                              <strong>Observações:</strong> {order.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
