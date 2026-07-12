import { formatCurrency } from "./utils";
import { PAYMENT_METHODS_LABELS } from "./constants";

interface WhatsAppOrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

interface WhatsAppOrder {
  fullName: string;
  phone: string;
  street: string;
  number: string;
  district: string;
  city: string;
  zipCode: string;
  complement?: string;
  paymentMethod: string;
  changeFor?: number;
  notes?: string;
  items: WhatsAppOrderItem[];
  total: number;
  deliveryFee: number;
}

export function buildWhatsAppMessage(order: WhatsAppOrder): string {
  const address = `${order.street}, ${order.number} - ${order.district}`;
  const cityLine = `${order.city} - CEP: ${order.zipCode}`;
  const complement = order.complement ? `\nComplemento: ${order.complement}` : "";

  const paymentLabel = PAYMENT_METHODS_LABELS[order.paymentMethod] || order.paymentMethod;
  const paymentInfo =
    order.paymentMethod === "cash" && order.changeFor
      ? `${paymentLabel} (Troco para: ${formatCurrency(order.changeFor)})`
      : paymentLabel;

  const itemsList = order.items
    .map(
      (item) => `  ${item.name} x${item.quantity} — ${formatCurrency(item.unitPrice * item.quantity)}`
    )
    .join("\n");

  const notes = order.notes ? `\n\nObs: ${order.notes}` : "";

  return (
    `*Pedido - Gelato & Sorvetes*\n` +
    `\n` +
    `*Cliente:* ${order.fullName}\n` +
    `*Tel:* ${order.phone}\n` +
    `\n` +
    `*Endereco:*\n` +
    `  ${address}\n` +
    `  ${cityLine}${complement}\n` +
    `\n` +
    `*Pagamento:* ${paymentInfo}\n` +
    `\n` +
    `*Itens:*\n` +
    `${itemsList}\n` +
    `\n` +
    `*Entrega:* ${formatCurrency(order.deliveryFee)}\n` +
    `*Total:* ${formatCurrency(order.total)}` +
    notes
  );
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  // Remove any non-numeric characters from phone number
  const cleanPhone = phoneNumber.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function formatOrderForConfirmation(order: {
  id: string;
  total: number;
  items: { name: string; quantity: number; unitPrice: number }[];
}): string {
  const itemsList = order.items
    .map((item) => `${item.name} x${item.quantity}`)
    .join(", ");

  return `Pedido #${order.id.slice(-8).toUpperCase()} - ${itemsList} - Total: ${formatCurrency(order.total)}`;
}
