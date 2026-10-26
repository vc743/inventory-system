import { z } from "zod";

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  userId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const categoryFormSchema = z.object({
  name: z.string().trim().min(1, "El nombre completo es requerido"),
});

export const categoryListItemSchema = categorySchema.extend({
  product: z.number(),
});

export const categoryListSchema = z.array(categoryListItemSchema);

export type CategoryType = z.infer<typeof categorySchema>;
export type CategoryFormType = z.infer<typeof categoryFormSchema>;
export type CategoryListItemType = z.infer<typeof categoryListItemSchema>;
