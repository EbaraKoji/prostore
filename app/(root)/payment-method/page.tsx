import { Metadata } from 'next';
import { auth } from '@/auth';
import { getUserById } from '@/lib/actions/user.actions';
import { PaymentMethodForm } from './payment-method-form';

export const metadata: Metadata = {
  title: 'Select Payment Method',
};

const PaymentMethodPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  if (userId === undefined) throw new Error('User not found.');
  const user = await getUserById(userId);
  if (user === null) throw new Error('User not found.');

  return (
    <div>
      <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
    </div>
  );
};

export default PaymentMethodPage;
