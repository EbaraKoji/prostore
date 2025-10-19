'use client';

import { createOrder } from '@/lib/actions/order.actions';
import { useFormStatus } from 'react-dom';
import { Check, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import React from 'react';

export const PlaceOrderForm = () => {
  const router = useRouter();
  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full cursor-pointer">
        {pending ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}{' '}
        Place Order
      </Button>
    );
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const res = await createOrder();
    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PlaceOrderButton />
    </form>
  );
};
