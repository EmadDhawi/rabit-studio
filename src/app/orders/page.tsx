'use client';

import * as React from 'react';
import AppLayout from '@/components/layout/app-layout';
import { OrdersTable } from "@/components/dashboard/orders-table";
import { CreateOrderDialog } from "@/components/dashboard/create-order-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { mockOrders, mockProducts } from '@/lib/data';
import type { Order } from '@/lib/types';


export default function OrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>(mockOrders);
  const products = mockProducts; // In a real app, this would likely be fetched

  const handleCreateOrder = (newOrderData: Omit<Order, 'id' | 'status' | 'date'>) => {
    const newOrder: Order = {
        ...newOrderData,
        id: `ORD${String(Date.now()).slice(-6)}`,
        status: 'New',
        date: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 h-full">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold font-headline text-foreground">Orders</h1>
          </div>
          <CreateOrderDialog products={products} onCreateOrder={handleCreateOrder}>
              <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Order
              </Button>
          </CreateOrderDialog>
        </header>
        <OrdersTable 
          orders={orders}
          onUpdateOrder={handleUpdateOrder}
          onDeleteOrder={handleDeleteOrder}
        />
      </div>
    </AppLayout>
  );
}
