'use server';

import type { CartItemSchema } from '@/types';

export type CartActionData = {
  success: boolean;
  message: string;
  formData?: FormData;
};

export async function addItemToCart(item: CartItemSchema): Promise<CartActionData | undefined> {
  return {
    success: true,
    message: `Item: "${item.name}" added to cart`,
  };
}
