import { redirect } from 'next/navigation';

export default function SettingsPage() {
  redirect('/orders');
  return null;
}
