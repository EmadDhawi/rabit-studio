import type { Order } from './types';

export const mockOrders: Order[] = [
  {
    id: 'ORD001',
    customerName: 'John Doe',
    destination: 'New York, USA',
    date: '2023-10-26',
    status: 'Delivered',
    items: [
      { product: { id: 'P001', name: 'T-Shirt', sku: 'TS-01' }, quantity: 2 },
      { product: { id: 'P002', name: 'Mug', sku: 'MG-01' }, quantity: 1 },
    ],
    notes: 'Customer requested gift wrapping.',
  },
  {
    id: 'ORD002',
    customerName: 'Jane Smith',
    destination: 'London, UK',
    date: '2023-10-25',
    status: 'Shipped',
    items: [
      { product: { id: 'P003', name: 'Hoodie', sku: 'HD-01' }, quantity: 1 },
    ],
    notes: 'Expedited shipping requested.',
  },
  {
    id: 'ORD003',
    customerName: 'Mike Johnson',
    destination: 'Tokyo, Japan',
    date: '2023-10-24',
    status: 'Prepared',
    items: [
      { product: { id: 'P001', name: 'T-Shirt', sku: 'TS-01' }, quantity: 5 },
      { product: { id: 'P004', name: 'Cap', sku: 'CP-01' }, quantity: 3 },
    ],
  },
  {
    id: 'ORD004',
    customerName: 'Emily Davis',
    destination: 'Sydney, Australia',
    date: '2023-10-23',
    status: 'New',
    items: [
      { product: { id: 'P002', name: 'Mug', sku: 'MG-01' }, quantity: 10 },
    ],
    notes: 'Fragile items, please handle with care.',
  },
  {
    id: 'ORD005',
    customerName: 'Chris Brown',
    destination: 'Berlin, Germany',
    date: '2023-10-22',
    status: 'Cancelled',
    items: [
      { product: { id: 'P003', name: 'Hoodie', sku: 'HD-01' }, quantity: 1 },
    ],
    notes: 'Customer cancelled due to wrong size.',
  },
  {
    id: 'ORD006',
    customerName: 'Patricia Miller',
    destination: 'Paris, France',
    date: '2023-10-21',
    status: 'Delivered',
    items: [
        { product: { id: 'P001', name: 'T-Shirt', sku: 'TS-01' }, quantity: 3 },
    ],
  },
  {
    id: 'ORD007',
    customerName: 'Robert Wilson',
    destination: 'Toronto, Canada',
    date: '2023-10-20',
    status: 'Shipped',
    items: [
        { product: { id: 'P004', name: 'Cap', sku: 'CP-01' }, quantity: 5 },
    ],
  },
];
