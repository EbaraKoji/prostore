import { cn } from '@/lib/utils';
import React from 'react';

interface Props {
  current: number;
}

export const CheckoutSteps = ({ current }: Props) => {
  return (
    <div className="flex-between flex-col md:flex-row space-x-2 space-y-2 mb-10">
      {['User Login', 'Shipping Address', 'Payment Method', 'Place Order'].map((step, idx) => (
        <React.Fragment key={step}>
          <div
            className={cn(
              'p-2 w-56 rounded-full text-center text-sm',
              idx === current ? 'bg-secondary' : '',
            )}
          >
            {step}
          </div>
          {step !== 'Place Order' && <hr className="w-64 md:w-16 border-t border-gray-300 mx-2" />}
        </React.Fragment>
      ))}
    </div>
  );
};
