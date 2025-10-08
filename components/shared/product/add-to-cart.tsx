'use client';

import { Button } from '@/components/ui/button';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import type { CartItemSchema, CartSchema } from '@/types';
import { Loader, Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { toastError } from '../toast/toast-error';

interface Props {
  item: CartItemSchema;
  cart?: CartSchema;
}

export const AddToCart = ({ cart, item }: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);
      if (!res?.success) {
        toastError(res?.message || 'Failed to add item to Cart.', isPending);
        return;
      }
      toast.success(res.message, {
        action: {
          label: 'Go To Cart',
          onClick: () => {
            router.push('/cart');
          },
        },
      });
    });
  };

  const existItem = cart && cart.items.find((cartItem) => cartItem.productId === item.productId);
  if (existItem === undefined) {
    return (
      <Button
        className="w-full cursor-pointer"
        type="button"
        onClick={handleAddToCart}
        disabled={isPending}
      >
        {isPending ? (
          <Loader className="animate-spin" />
        ) : (
          <>
            <Plus />
            <span>Add To Cart</span>
          </>
        )}
      </Button>
    );
  }

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(existItem.productId);
      if (!res?.success) {
        toastError(res?.message, isPending);
        return;
      }
      toast.success(res.message);
    });
  };

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        className="cursor-pointer"
        onClick={handleRemoveFromCart}
        disabled={isPending}
      >
        {isPending ? <Loader className="animate-spin" /> : <Minus />}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button
        type="button"
        variant="outline"
        className="cursor-pointer"
        onClick={handleAddToCart}
        disabled={isPending}
      >
        {isPending ? <Loader className="animate-spin" /> : <Plus />}
      </Button>
    </div>
  );
};
