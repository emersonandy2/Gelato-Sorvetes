"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, MessageCircle, Package, ArrowRight, Loader2 } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getOrderByIdAction } from "@/features/orders/actions/orders.actions";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { formatCurrency } from "@/lib/utils";
import type { OrderWithItems } from "@/features/orders/types/orders.types";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [whatsappUrl, setWhatsappUrl] = useState("");

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    async function loadOrder() {
      const data = await getOrderByIdAction(orderId!);
      if (data && !("success" in data && data.success === false)) {
        setOrder(data as unknown as OrderWithItems);

        // Build WhatsApp message
        const orderData = data as Record<string, unknown>;
        const message = buildWhatsAppMessage({
          fullName: orderData.fullName as string,
          phone: orderData.phone as string,
          street: orderData.street as string,
          number: orderData.number as string,
          district: orderData.district as string,
          city: orderData.city as string,
          zipCode: orderData.zipCode as string,
          complement: (orderData.complement as string) || undefined,
          paymentMethod: orderData.paymentMethod as string,
          changeFor: orderData.changeFor ? Number(orderData.changeFor) : undefined,
          notes: (orderData.notes as string) || undefined,
          items: (orderData.items as { product: { name: string }; quantity: number; unitPrice: number }[]).map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice),
          })),
          total: Number(orderData.total),
          deliveryFee: Number(orderData.deliveryFee),
        });

        const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "558896357773";
        setWhatsappUrl(buildWhatsAppUrl(phone, message));
      }
      setIsLoading(false);
    }

    loadOrder();
  }, [orderId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground mb-4">Pedido não encontrado</p>
          <Button onClick={() => router.push("/")}>Voltar ao Início</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
          </div>

          <h1 className="text-3xl font-bold mb-2">Pedido Confirmado!</h1>
          <p className="text-muted-foreground mb-8">
            Seu pedido foi realizado com sucesso. Envie pelo WhatsApp para confirmar.
          </p>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="text-left space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Número do Pedido</span>
                  <span className="font-mono font-bold">
                    #{order.id.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                    Aguardando confirmação
                  </span>
                </div>
                <div className="border-t pt-4">
                  <span className="text-muted-foreground">Itens</span>
                  <div className="mt-2 space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.product.name} x{item.quantity}
                        </span>
                        <span>{formatCurrency(Number(item.unitPrice) * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(Number(order.total))}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-green-500 hover:bg-green-600">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Enviar pelo WhatsApp
                </Button>
              </a>
            )}
            <Link href="/orders">
              <Button size="lg" variant="outline">
                <Package className="mr-2 h-5 w-5" />
                Meus Pedidos
              </Button>
            </Link>
            <Link href="/catalog">
              <Button size="lg" variant="ghost">
                Continuar Comprando
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </main>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
