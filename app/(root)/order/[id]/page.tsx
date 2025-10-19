import { getOrderById } from '@/lib/actions/order.actions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import OrderDetailsTable from './order-details-table';

export const metadata: Metadata = {
  title: 'Order Details',
};

interface Props {
  params: Promise<{ id: string }>;
}

const OrderDetailsPage = async ({ params }: Props) => {
  const { id } = await params;
  const order = await getOrderById(id);
  if (order === null) notFound();

  return <OrderDetailsTable order={JSON.parse(JSON.stringify(order))} />;
};

export default OrderDetailsPage;
