export type OrderStatus = 'New' | 'Prepared' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Issue';

export type Product = {
  id: string;
  name: string;
  sku: string;
};

export type OrderItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  customerName: string;
  destination: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
};
