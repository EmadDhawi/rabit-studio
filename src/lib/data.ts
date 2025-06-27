import type { Order, Product } from './types';

export const mockProducts: Product[] = [
  { id: 'P001', name: 'Classic T-Shirt', sku: 'TS-01-BLK', imageUrl: 'https://placehold.co/80x80.png', quantity: 120, active: true },
  { id: 'P002', name: 'Coffee Mug', sku: 'MG-01-WHT', imageUrl: 'https://placehold.co/80x80.png', quantity: 75, active: true },
  { id: 'P003', name: 'Cozy Hoodie', sku: 'HD-01-GRY', imageUrl: 'https://placehold.co/80x80.png', quantity: 0, active: false },
  { id: 'P004', name: 'Baseball Cap', sku: 'CP-01-NAV', imageUrl: 'https://placehold.co/80x80.png', quantity: 200, active: true },
  { id: 'P005', name: 'Sticker Pack', sku: 'STK-01-MIX', imageUrl: 'https://placehold.co/80x80.png', quantity: 500, active: true },
];

export const mockOrders: Order[] = [
  {
    id: 'ORD001',
    customerName: 'John Doe',
    customerPhone: '123-456-7890',
    destination: 'New York, USA',
    date: '2023-10-26',
    status: 'Delivered',
    items: [
      { product: { id: 'P001', name: 'Classic T-Shirt', sku: 'TS-01-BLK' }, quantity: 2 },
      { product: { id: 'P002', name: 'Coffee Mug', sku: 'MG-01-WHT' }, quantity: 1 },
    ],
    notes: [
      { id: 'N001', content: 'Customer requested gift wrapping.', date: '2023-10-26T10:00:00Z', resolved: true },
    ],
    shippingCompany: 'FedEx',
    driver: 'Mike Ross',
  },
  {
    id: 'ORD002',
    customerName: 'Jane Smith',
    customerPhone: '234-567-8901',
    destination: 'London, UK',
    date: '2023-10-25',
    status: 'Shipped',
    items: [
      { product: { id: 'P003', name: 'Cozy Hoodie', sku: 'HD-01-GRY' }, quantity: 1 },
    ],
    notes: [
      { id: 'N002', content: 'Expedited shipping requested.', date: '2023-10-25T11:00:00Z', resolved: true },
      { id: 'N005', content: 'Confirm address with customer, seems to be a typo.', date: '2023-10-25T12:00:00Z', resolved: false }
    ],
    shippingCompany: 'DHL',
    driver: 'Sarah Connor',
  },
  {
    id: 'ORD003',
    customerName: 'Mike Johnson',
    customerPhone: '345-678-9012',
    destination: 'Tokyo, Japan',
    date: '2023-10-24',
    status: 'Prepared',
    items: [
      { product: { id: 'P001', name: 'Classic T-Shirt', sku: 'TS-01-BLK' }, quantity: 5 },
      { product: { id: 'P004', name: 'Baseball Cap', sku: 'CP-01-NAV' }, quantity: 3 },
    ],
  },
  {
    id: 'ORD004',
    customerName: 'Emily Davis',
    customerPhone: '456-789-0123',
    destination: 'Sydney, Australia',
    date: '2023-10-23',
    status: 'New',
    items: [
      { product: { id: 'P002', name: 'Coffee Mug', sku: 'MG-01-WHT' }, quantity: 10 },
    ],
    notes: [
      { id: 'N003', content: 'Fragile items, please handle with care.', date: '2023-10-23T09:00:00Z', resolved: false },
    ],
  },
  {
    id: 'ORD005',
    customerName: 'Chris Brown',
    customerPhone: '567-890-1234',
    destination: 'Berlin, Germany',
    date: '2023-10-22',
    status: 'Cancelled',
    items: [
      { product: { id: 'P003', name: 'Cozy Hoodie', sku: 'HD-01-GRY' }, quantity: 1 },
    ],
    notes: [
      { id: 'N004', content: 'Customer cancelled due to wrong size.', date: '2023-10-22T14:00:00Z', resolved: true },
    ],
  },
  {
    id: 'ORD006',
    customerName: 'Patricia Miller',
    customerPhone: '678-901-2345',
    destination: 'Paris, France',
    date: '2023-10-21',
    status: 'Delivered',
    items: [
        { product: { id: 'P001', name: 'Classic T-Shirt', sku: 'TS-01-BLK' }, quantity: 3 },
    ],
    shippingCompany: 'Chronopost',
    driver: 'Jean-Luc Picard',
  },
  {
    id: 'ORD007',
    customerName: 'Robert Wilson',
    customerPhone: '789-012-3456',
    destination: 'Toronto, Canada',
    date: '2023-10-20',
    status: 'Shipped',
    items: [
        { product: { id: 'P004', name: 'Baseball Cap', sku: 'CP-01-NAV' }, quantity: 5 },
    ],
    shippingCompany: 'Canada Post',
  },
];
