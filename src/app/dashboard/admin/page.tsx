import { redirect } from 'next/navigation';

export default function AdminPage() {
  redirect('/dashboard/orders');
  return null;
}
