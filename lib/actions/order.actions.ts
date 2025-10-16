'use server';

import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { CartItemSchema } from '@/types';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { insertOrderSchema } from '../validators';
import { getMyCart } from './cart.actions';
import { getUserById } from './user.actions';

export async function createOrder() {
  try {
    const session = await auth();
    if (session === null) throw new Error('User is not authenticated.');

    const cart = await getMyCart();
    const userId = session?.user?.id;
    if (userId === undefined) throw new Error('User not found');

    const user = await getUserById(userId);
    if (user === null) throw new Error('User not found');

    if (cart === undefined || cart.items.length === 0) {
      return { success: false, message: 'Your cart is empty', reditrctTo: '/cart' };
    }
    if (user.address === null) {
      return { success: false, message: 'No Shipping Address', reditrctTo: '/shipping-address' };
    }
    if (user.paymentMethod === null) {
      return { success: false, message: 'No payment method', reditrctTo: '/payment-method' };
    }

    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    const insertedOrderId = await prisma.$transaction(async (tx) => {
      const insertedOrder = await tx.order.create({ data: order });
      (cart.items as CartItemSchema[]).map(async (item) => {
        await tx.orderItem.create({
          data: { ...item, price: item.price, orderId: insertedOrder.id },
        });
      });
      await tx.cart.update({
        where: { id: cart.id },
        data: { items: [], totalPrice: 0, taxPrice: 0, shippingPrice: 0, itemsPrice: 0 },
      });
      return insertedOrder.id;
    });

    return {
      success: true,
      message: 'Successfully created the order.',
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: (error as Error).message };
  }
}
