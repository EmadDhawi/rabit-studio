'use client';

import * as React from 'react';
import AppLayout from '@/components/layout/app-layout';
import { OrdersTable } from "@/components/dashboard/orders-table";
import { CreateOrderDialog } from "@/components/dashboard/create-order-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import type { Order, Product } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';


export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const productsQuery = query(collection(db, 'products'), orderBy('name'));

    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
          shippedAt: data.shippedAt?.toDate ? data.shippedAt.toDate().toISOString() : null,
        } as Order;
      });
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders: ", error);
      setLoading(false);
    });
    
    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(productsData);
    }, (error) => {
      console.error("Error fetching products: ", error);
    });

    return () => {
        unsubscribeOrders();
        unsubscribeProducts();
    };
  }, [user]);

  const handleCreateOrder = async (newOrderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'shippedAt'>) => {
    if (!user) return;
    await addDoc(collection(db, 'orders'), {
        ...newOrderData,
        status: 'New',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        shippedAt: null,
    });
  };

  const handleUpdateOrder = async (updatedOrder: Order) => {
    if (!user) return;
    const orderRef = doc(db, 'orders', updatedOrder.id);
    const originalOrder = orders.find(o => o.id === updatedOrder.id);

    const payload: { [key: string]: any } = {
        customerName: updatedOrder.customerName,
        customerPhone: updatedOrder.customerPhone,
        destination: updatedOrder.destination,
        status: updatedOrder.status,
        items: updatedOrder.items,
        notes: updatedOrder.notes || [],
        shippingCompany: updatedOrder.shippingCompany || '',
        driver: updatedOrder.driver || '',
        updatedAt: serverTimestamp(),
    };

    if (updatedOrder.status === 'Shipped' && originalOrder?.status !== 'Shipped') {
        payload.shippedAt = serverTimestamp();
    } else if (updatedOrder.status !== 'Shipped' && originalOrder?.status === 'Shipped') {
        payload.shippedAt = null;
    }
    
    await updateDoc(orderRef, payload);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'orders', orderId));
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      )
    }

    return (
      <OrdersTable 
        orders={orders}
        onUpdateOrder={handleUpdateOrder}
        onDeleteOrder={handleDeleteOrder}
      />
    );
  }

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
        {renderContent()}
      </div>
    </AppLayout>
  );
}
