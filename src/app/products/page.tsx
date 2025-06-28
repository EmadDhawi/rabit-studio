'use client';

import * as React from 'react';
import AppLayout from '@/components/layout/app-layout';
import { Button } from "@/components/ui/button";
import { ProductsTable } from "@/components/dashboard/products-table";
import { PlusCircle } from "lucide-react";
import { CreateProductDialog } from '@/components/dashboard/create-product-dialog';
import type { Product } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsPage() {
  const { user, brand, brandLoading } = useAuth();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (brandLoading || !brand) {
      setLoading(brandLoading);
      return;
    }

    const q = query(collection(db, 'brands', brand.id, 'products'), orderBy('name'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(productsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [brand, brandLoading]);

  const handleCreateProduct = async (newProduct: Omit<Product, 'id' | 'brandId'>) => {
    if (!user || !brand) return;
    const productsCollection = collection(db, 'brands', brand.id, 'products');
    await addDoc(productsCollection, { ...newProduct, brandId: brand.id });
  };
  
  const handleUpdateProduct = async (updatedProduct: Product) => {
    if (!user || !brand) return;
    const { id, ...dataToUpdate } = updatedProduct;
    const productRef = doc(db, 'brands', brand.id, 'products', id);
    await updateDoc(productRef, dataToUpdate);
  };
  
  const handleDeleteProduct = async (productId: string) => {
    if (!user || !brand) return;
    const productRef = doc(db, 'brands', brand.id, 'products', productId);
    await deleteDoc(productRef);
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
        <ProductsTable 
          products={products}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
        />
    );
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 h-full">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold font-headline text-foreground">Products</h1>
          </div>
          <CreateProductDialog onCreateProduct={handleCreateProduct}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Product
            </Button>
          </CreateProductDialog>
        </header>
        {renderContent()}
      </div>
    </AppLayout>
  );
}
