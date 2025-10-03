'use server';

import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import type { CartItemSchema } from '@/types';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { round } from '../utils';
import { cartItemSchema, insertCartSchema } from '../validators';
import { Prisma } from '../generated/prisma';

const calcPrice = (items: CartItemSchema[]) => {
  const itemsPrice = round(items.reduce((sum, item) => sum + Number(item.price) * item.qty, 0));
  const shippingPrice = round(itemsPrice > 100 ? 0 : 100);
  const taxPrice = round(0.15 * itemsPrice);
  const totalPrice = round(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export type CartActionData = {
  success: boolean;
  message: string;
  formData?: FormData;
};

export async function addItemToCart(data: CartItemSchema): Promise<CartActionData | undefined> {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found.');

    const session = await auth();
    const userId = session?.user?.id ? session.user.id : undefined;

    const cart = await getMyCart();
    const item = cartItemSchema.parse(data);
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    if (product === null) throw new Error('Product not found.');
    if (cart === undefined) {
      const newCart = insertCartSchema.parse({
        userId,
        items: [item],
        sessionCartId,
        ...calcPrice([item]),
      });
      await prisma.cart.create({
        data: newCart,
      });
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      const existItemIdx = (cart.items as CartItemSchema[]).findIndex(
        (cartItem) => cartItem.productId === item.productId,
      );
      if (existItemIdx === -1) {
        // item does not exist in cart
        if (product.stock < 1) throw new Error('Not enough stock.');
        cart.items.push(item);
      } else {
        if (product.stock < cart.items[existItemIdx].qty + 1) {
          throw new Error('Not enough stock');
        }
        cart.items[existItemIdx].qty += 1;
      }
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItemSchema[]),
        },
      });
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} ${existItemIdx === -1 ? 'added to' : 'updated in'} cart`,
      };
    }
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function getMyCart() {
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  if (!sessionCartId) throw new Error('Cart session not found.');

  const session = await auth();
  const userId = session?.user?.id ? session.user.id : undefined;

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });
  if (!cart) return undefined;
  return {
    ...cart,
    items: cart.items as CartItemSchema[],
    itemsPrice: cart.itemsPrice.toNumber(),
    totalPrice: cart.totalPrice.toNumber(),
    shippingPrice: cart.shippingPrice.toNumber(),
    taxPrice: cart.taxPrice.toString(),
  };
}
