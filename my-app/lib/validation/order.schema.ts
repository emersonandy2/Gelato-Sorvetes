import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(3, "Nome completo é obrigatório"),
  phone: z.string().min(10, "Telefone inválido"),
  zipCode: z.string().min(8, "CEP inválido"),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  district: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  paymentMethod: z.enum(["cash", "pix", "credit_card", "debit_card"]),
  changeFor: z.number().optional(),
  notes: z.string().optional(),
  couponCode: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
