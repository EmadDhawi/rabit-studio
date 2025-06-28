'use client';

import * as React from 'react';
import AppLayout from '@/components/layout/app-layout';
import { OrdersTable } from "@/components/dashboard/orders-table";
import { CreateOrderDialog } from "@/components/dashboard/create-order-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import type { Order, Product, Note } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, getDocs, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';


export default function OrdersPage() {
  const { user, brand, brandLoading } = useAuth();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (brandLoading || !brand) {
      setLoading(brandLoading);
      return;
    }

    const ordersQuery = query(collection(db, 'orders'), where("brandId", "==", brand.id), orderBy('createdAt', 'desc'));
    const productsQuery = query(collection(db, 'brands', brand.id, 'products'), orderBy('name'));

    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
        const ordersDataPromises = snapshot.docs.map(async (orderDoc) => {
            const orderData = orderDoc.data();
            const notesCollectionRef = collection(db, 'orders', orderDoc.id, 'notes');
            const notesQuery = query(notesCollectionRef, orderBy('date', 'desc'));
            const notesSnapshot = await getDocs(notesQuery);
            const notes = notesSnapshot.docs.map(noteDoc => {
                const noteData = noteDoc.data();
                return { 
                    id: noteDoc.id, 
                    ...noteData,
                    date: noteData.date?.toDate ? noteData.date.toDate().toISOString() : new Date().toISOString(),
                } as Note
            });

            return {
              ...orderData,
              id: orderDoc.id,
              notes,
              createdAt: orderData.createdAt?.toDate ? orderData.createdAt.toDate().toISOString() : new Date().toISOString(),
              updatedAt: orderData.updatedAt?.toDate ? orderData.updatedAt.toDate().toISOString() : new Date().toISOString(),
              shippedAt: orderData.shippedAt?.toDate ? orderData.shippedAt.toDate().toISOString() : null,
            } as Order;
        });
        
        Promise.all(ordersDataPromises).then(ordersData => {
            setOrders(ordersData);
            setLoading(false);
        });
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
  }, [brand, brandLoading]);

  const handleCreateOrder = async (newOrderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'shippedAt' | 'brandId'>) => {
    if (!user || !brand) return;
    await addDoc(collection(db, 'orders'), {
        ...newOrderData,
        brandId: brand.id,
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { notes, ...payload } : any = {
        customerName: updatedOrder.customerName,
        customerPhone: updatedOrder.customerPhone,
        destination: updatedOrder.destination,
        status: updatedOrder.status,
        items: updatedOrder.items.map(item => ({
          product: {
            id: item.product.id,
            brandId: item.product.brandId,
            name: item.product.name,
            sku: item.product.sku,
            imageUrl: item.product.imageUrl,
            quantity: item.product.quantity,
            active: item.product.active,
          },
          quantity: item.quantity,
        })),
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
  
  const handleAddNote = async (orderId: string, noteContent: string) => {
    if (!user || !noteContent.trim()) return;
    const notesCollectionRef = collection(db, 'orders', orderId, 'notes');
    await addDoc(notesCollectionRef, {
        content: noteContent,
        date: serverTimestamp(),
        resolved: false,
    });
    // Trigger a refresh by updating the parent order's timestamp
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { updatedAt: serverTimestamp() });
  }

  const handleUpdateNoteResolved = async (orderId: string, noteId: string, resolved: boolean) => {
    if (!user) return;
    const noteRef = doc(db, 'orders', orderId, 'notes', noteId);
    await updateDoc(noteRef, { resolved });
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { updatedAt: serverTimestamp() });
  }

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
        onAddNote={handleAddNote}
        onUpdateNoteResolved={handleUpdateNoteResolved}
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
