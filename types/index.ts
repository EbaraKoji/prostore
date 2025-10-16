import {
  cartItemSchema,
  insertCartSchema,
  insertOrderItemSchema,
  insertOrderSchema,
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
export type OrderSchema = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderItems: OrderItemSchema[];
  user: { name: string; email: string };
};
export type OrderItemSchema = z.infer<typeof insertOrderItemSchema>;
