import {
  cartItemSchema,
  insertCartSchema,
  insertProductSchema,
  paymentMethodSchema,
  shippingAddressSchema,
} from '@/lib/validators';
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
export type ShippingAddressSchema = z.infer<typeof shippingAddressSchema>;
export type PaymentMethodSchema = z.infer<typeof paymentMethodSchema>;
