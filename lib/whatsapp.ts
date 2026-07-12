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
  const address = `${order.street}, ${order.number} - ${order.district}, ${order.city} - CEP: ${order.zipCode}`;
  const complement = order.complement ? `\nComplemento: ${order.complement}` : "";

  const paymentLabel = PAYMENT_METHODS_LABELS[order.paymentMethod] || order.paymentMethod;
  const paymentInfo =
    order.paymentMethod === "cash" && order.changeFor
      ? `${paymentLabel} (Troco para: ${formatCurrency(order.changeFor)})`
      : paymentLabel;

  const itemsList = order.items
    .map(
      (item) => `• ${item.name} x${item.quantity} - ${formatCurrency(item.unitPrice * item.quantity)}`
    )
    .join("\n");

  const notes = order.notes ? `\n${order.notes}` : "Nenhuma";

  return (
    `🛒 *NOVO PEDIDO RECEBIDO!*\n` +
    `\n` +
    `👤 *Cliente:* ${order.fullName}\n` +
    `📞 *Telefone:* ${order.phone}\n` +
    `📍 *Endereço:* ${address}${complement}\n` +
    `💳 *Forma de Pagamento:* ${paymentInfo}\n` +
    `\n` +
    `🧾 *Itens do Pedido:*\n` +
    `${itemsList}\n` +
    `\n` +
    `📝 *Observações:*\n` +
    `${notes}\n` +
    `\n` +
    `💰 *Total do Pedido:* *${formatCurrency(order.total)}*\n` +
    `\n` +
    `🙏 Obrigado pela preferência! Seu pedido foi registrado com sucesso.`
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
