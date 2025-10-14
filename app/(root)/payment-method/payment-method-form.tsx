'use client';
import { toastError } from '@/components/shared/toast/toast-error';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { updateUserPaymentMethod } from '@/lib/actions/user.actions';
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from '@/lib/constants';
import { paymentMethodSchema } from '@/lib/validators';
import { PaymentMethodSchema } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { ControllerRenderProps, useForm } from 'react-hook-form';

interface Props {
  preferredPaymentMethod: string | null;
}

export const PaymentMethodForm = ({ preferredPaymentMethod }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<PaymentMethodSchema>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });
  const onSubmit = async (value: PaymentMethodSchema) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(value);
      if (res.success) {
        router.push('/place-order');
      } else {
        toastError(res.message, isPending);
      }
    });
  };
  return (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Payment Method</h1>
        <p className="text-sm text-muted-foreground">Please select a payment method</p>
        <Form {...form}>
          <form method="post" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="type"
                render={({ field }: { field: ControllerRenderProps<PaymentMethodSchema> }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Payment type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={DEFAULT_PAYMENT_METHOD}
                        className="flex flex-col space-y-2"
                      >
                        {PAYMENT_METHODS.map((pMethod) => (
                          <div key={pMethod} className="flex items-center gap-3">
                            <RadioGroupItem
                              value={pMethod}
                              id={pMethod}
                              className="cursor-pointer"
                              checked={field.value === pMethod}
                            />
                            <Label htmlFor={pMethod}>{pMethod}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isPending} className="cursor-pointer">
                {isPending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}{' '}
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};
