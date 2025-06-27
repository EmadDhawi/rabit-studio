import { redirect } from 'next/navigation';

export default function DeprecatedProductsPage() {
  redirect('/products');
  return null;
}
