export type OrderStatus = 'New' | 'Prepared' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Issue';

export type Brand = {
  id: string;
  name: string;
  logo?: string;
  phone?: string;
  owner: string;
  active: boolean;
  deleted: boolean;
  createdAt: any;
  updatedAt: any;
}

export type Product = {
  id: string;
  brandId: string;
  name: string;
  sku: string;
  imageUrl?: string;
  quantity?: number;
  active?: boolean;
};

export type OrderItem = {
  product: Product;
  quantity: number;
};

export type Note = {
  id:string;
  content: string;
  date: string;
  resolved: boolean;
};

export type Order = {
  id: string;
  brandId: string;
  customerName: string;
  customerPhone: string;
  destination: string;
  status: OrderStatus;
  items: OrderItem[];
  notes?: Note[];
  shippingCompany?: string;
  driver?: string;
  createdAt: any;
  updatedAt: any;
  shippedAt?: any | null;
};
