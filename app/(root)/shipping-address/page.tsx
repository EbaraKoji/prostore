import { auth } from '@/auth';
import { CheckoutSteps } from '@/components/shared/checkout-steps';
import { getMyCart } from '@/lib/actions/cart.actions';
import { getUserById } from '@/lib/actions/user.actions';
import { ShippingAddressSchema } from '@/types';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ShippingAddressForm } from './shipping-address-form';

export const metadata: Metadata = {
  title: 'Shippin Address',
};

const ShippingAddressPage = async () => {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect('/cart');
  const session = await auth();
  const userId = session?.user?.id;
  if (userId === undefined) throw new Error('No user ID in the session.');
  const user = await getUserById(userId);
  if (user === null) throw new Error('User not found.');
  return (
    <>
      <CheckoutSteps current={1}/>
      <ShippingAddressForm address={user.address as ShippingAddressSchema} />
    </>
  );
};

export default ShippingAddressPage;
