'use client';

import { Button } from '@/components/ui/button';
import { addItemToCart } from '@/lib/actions/cart.actions';
import type { CartItemSchema } from '@/types';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Props {
  item: CartItemSchema;
}

export const AddToCart = ({ item }: Props) => {
  const router = useRouter();
  const handleAddToCart = async () => {
    const res = await addItemToCart(item);
    if (!res?.success) {
      // toast.error(res?.message);
      toast.custom((t) => (
        <div className="flex space-x-4 items-center bg-red-200 border border-red-400 rounded-lg px-2 py-1">
          <span className="text-sm text-red-700 font-semibold">{res?.message}</span>
          <Button
            onClick={() => toast.dismiss(t)}
            variant="destructive"
            className="px-1 text-xs cursor-pointer"
          >
            Close
          </Button>
        </div>
      ));
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
  };
  return (
    <Button className="w-full cursor-pointer" type="button" onClick={handleAddToCart}>
      <Plus />
      <span>Add To Cart</span>
    </Button>
  );
};
