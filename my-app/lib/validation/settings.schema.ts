import { z } from "zod";

export const storeSettingsSchema = z.object({
  store_name: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  opening_hours: z.string().optional(),
  minimum_order: z.string().optional(),
  delivery_fee: z.string().optional(),
  google_maps_link: z.string().optional(),
  whatsapp_message_template: z.string().optional(),
});

export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;
