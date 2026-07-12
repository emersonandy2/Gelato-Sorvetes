export const SITE_NAME = "Gelato & Sorvetes";
export const SITE_DESCRIPTION = "Os melhores sorvetes artesanais da cidade";

export const PRODUCT_PAGE_SIZE = 12;

export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  READY: "ready",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  preparing: "Preparando",
  ready: "Pronto",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

export const PAYMENT_METHODS = {
  CASH: "cash",
  PIX: "pix",
  CREDIT_CARD: "credit_card",
  DEBIT_CARD: "debit_card",
} as const;

export const PAYMENT_METHODS_LABELS: Record<string, string> = {
  cash: "Dinheiro",
  pix: "PIX",
  credit_card: "Cartão de Crédito",
  debit_card: "Cartão de Débito",
};

export const OTP_EXPIRY_MINUTES = 5;
export const OTP_LENGTH = 6;

export const MAX_PRODUCT_IMAGES = 5;
export const MAX_IMAGE_SIZE_MB = 5;
