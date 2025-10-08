import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.actions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ShippingAddressSchema } from '@/types';
import { getUserById } from '@/lib/actions/user.actions';
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
    <div>
      <ShippingAddressForm address={user.address as ShippingAddressSchema} />
    </div>
  );
};

export default ShippingAddressPage;
