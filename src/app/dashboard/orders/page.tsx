import { redirect } from 'next/navigation';

export default function DeprecatedOrdersPage() {
  redirect('/orders');
  return null;
}
