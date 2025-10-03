import { insertProductSchema, insertCartSchema, cartItemSchema } from '@/lib/validators';
import z from 'zod';

export type ProductSchema = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
};

export type CartSchema = z.infer<typeof insertCartSchema> & {
  id: string;
};
export type CartItemSchema = z.infer<typeof cartItemSchema>;
