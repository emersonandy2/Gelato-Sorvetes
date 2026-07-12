"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Tag, CreditCard, Banknote, Smartphone, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { checkoutSchema, type CheckoutInput } from "@/lib/validation/order.schema";
import { useCartStore } from "@/store/use-cart-store";
import { createOrderAction, validateCouponAction, calculateDeliveryFeeAction } from "@/features/orders/actions/orders.actions";
import { formatCurrency } from "@/lib/utils";
import { OrderSummary } from "./order-summary";

export function CheckoutForm() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(5);
  const [isCalculatingFee, setIsCalculatingFee] = useState(false);

  const subtotal = getTotal();
  const total = subtotal + deliveryFee - couponDiscount;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "pix",
    },
  });

  const paymentMethod = watch("paymentMethod");

  async function handleApplyCoupon() {
    if (!couponCode.trim()) return;

    setIsValidatingCoupon(true);
    try {
      const result = await validateCouponAction(couponCode, subtotal);
      if (result.valid && result.discount) {
        setCouponDiscount(result.discount);
        toast.success(result.message);
      } else {
        setCouponDiscount(0);
        toast.error(result.message);
      }
    } catch {
      toast.error("Erro ao validar cupom");
    } finally {
      setIsValidatingCoupon(false);
    }
  }

  async function calculateFee(neighborhood: string) {
    if (!neighborhood) return;
    setIsCalculatingFee(true);
    try {
      const fee = await calculateDeliveryFeeAction(neighborhood);
      setDeliveryFee(fee);
    } catch {
      // Keep default fee
    } finally {
      setIsCalculatingFee(false);
    }
  }

  async function onSubmit(data: CheckoutInput) {
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderInput = {
        ...data,
        cartItems: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        couponCode: couponCode || undefined,
      };

      const result = await createOrderAction(orderInput);

      if (result.success && "orderId" in result && result.orderId) {
        toast.success(result.message);
        clearCart();
        router.push(`/checkout/success?orderId=${result.orderId}`);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Erro ao criar pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Seu carrinho está vazio</p>
        <Button onClick={() => router.push("/catalog")}>Ver Cardápio</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Fields */}
      <div className="lg:col-span-2 space-y-6">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dados Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo *</Label>
                <Input id="fullName" {...register("fullName")} placeholder="Seu nome completo" />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input id="phone" {...register("phone")} placeholder="(11) 99999-9999" />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Endereço de Entrega</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP *</Label>
                <Input id="zipCode" {...register("zipCode")} placeholder="00000-000" />
                {errors.zipCode && (
                  <p className="text-sm text-destructive">{errors.zipCode.message}</p>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="street">Rua *</Label>
                <Input id="street" {...register("street")} placeholder="Nome da rua" />
                {errors.street && (
                  <p className="text-sm text-destructive">{errors.street.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number">Número *</Label>
                <Input id="number" {...register("number")} placeholder="123" />
                {errors.number && (
                  <p className="text-sm text-destructive">{errors.number.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">Bairro *</Label>
                <Input id="district" {...register("district")} placeholder="Bairro" />
                {errors.district && (
                  <p className="text-sm text-destructive">{errors.district.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input id="city" {...register("city")} placeholder="Cidade" />
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input id="complement" {...register("complement")} placeholder="Apto, Bloco, etc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro/Referência</Label>
                <Input
                  id="neighborhood"
                  {...register("neighborhood")}
                  placeholder="Ponto de referência"
                  onBlur={(e) => calculateFee(e.target.value)}
                />
                {isCalculatingFee && (
                  <p className="text-xs text-muted-foreground">Calculando taxa de entrega...</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Forma de Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value: string | null) => {
                if (value) {
                  // Find the hidden input and trigger react-hook-form
                  const input = document.querySelector(`input[name="paymentMethod"][value="${value}"]`) as HTMLInputElement;
                  if (input) {
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                      window.HTMLInputElement.prototype,
                      "value"
                    )?.set;
                    if (nativeInputValueSetter) {
                      nativeInputValueSetter.call(input, value);
                      input.dispatchEvent(new Event("input", { bubbles: true }));
                      input.dispatchEvent(new Event("change", { bubbles: true }));
                    }
                  }
                }
              }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { value: "pix", label: "PIX", icon: Smartphone },
                { value: "cash", label: "Dinheiro", icon: Banknote },
                { value: "credit_card", label: "Crédito", icon: CreditCard },
                { value: "debit_card", label: "Débito", icon: Wallet },
              ].map(({ value, label, icon: Icon }) => (
                <label
                  key={value}
                  className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  aria-label={`Pagar com ${label}`}
                >
                  <RadioGroupItem value={value} className="sr-only" />
                  <Icon className="h-6 w-6" aria-hidden="true" />
                  <span className="text-sm font-medium">{label}</span>
                </label>
              ))}
            </RadioGroup>

            {paymentMethod === "cash" && (
              <div className="space-y-2">
                <Label htmlFor="changeFor">Troco para (opcional)</Label>
                <Input
                  id="changeFor"
                  type="number"
                  step="0.01"
                  {...register("changeFor", { valueAsNumber: true })}
                  placeholder="Ex: 50.00"
                />
              </div>
            )}

            {errors.paymentMethod && (
              <p className="text-sm text-destructive">{errors.paymentMethod.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              {...register("notes")}
              placeholder="Alguma observação sobre o pedido? Ex: sem cebola, ponto ao ponto..."
              rows={3}
            />
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Order Summary */}
        <Card>
          <CardContent className="p-6">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              discount={couponDiscount}
              total={total}
            />
          </CardContent>
        </Card>

        {/* Coupon */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4" />
              <span className="font-medium">Cupom de Desconto</span>
            </div>
            <div className="flex gap-2">
              <Input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Digite o código"
                className="uppercase"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleApplyCoupon}
                disabled={isValidatingCoupon || !couponCode.trim()}
              >
                {isValidatingCoupon ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Aplicar"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Submit */}
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            `Confirmar Pedido - ${formatCurrency(total)}`
          )}
        </Button>
      </div>
    </form>
  );
}
