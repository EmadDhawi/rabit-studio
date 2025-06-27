import { redirect } from 'next/navigation';

export default function SettingsPage() {
  redirect('/dashboard/orders');
  return null;
}
