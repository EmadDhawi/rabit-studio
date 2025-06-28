'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
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

function ProductsPageContent() {
  const { user, brand, isAdmin } = useAuth();
  const searchParams = useSearchParams();
  const adminBrandId = searchParams.get('brandId');
  
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [targetBrandId, setTargetBrandId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let id: string | null = null;
    if (isAdmin && adminBrandId) {
        id = adminBrandId;
    } else if (brand) {
        id = brand.id;
    }
    setTargetBrandId(id);
  }, [isAdmin, adminBrandId, brand]);

  React.useEffect(() => {
    if (!targetBrandId) {
      setLoading(false);
      setProducts([]);
      return;
    }

    setLoading(true);
    const q = query(collection(db, 'brands', targetBrandId, 'products'), orderBy('name'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(productsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [targetBrandId]);

  const handleCreateProduct = async (newProduct: Omit<Product, 'id' | 'brandId'>) => {
    if (!user || !targetBrandId) return;
    const productsCollection = collection(db, 'brands', targetBrandId, 'products');
    await addDoc(productsCollection, { ...newProduct, brandId: targetBrandId });
  };
  
  const handleUpdateProduct = async (updatedProduct: Product) => {
    if (!user || !targetBrandId) return;
    const { id, ...dataToUpdate } = updatedProduct;
    const productRef = doc(db, 'brands', targetBrandId, 'products', id);
    await updateDoc(productRef, dataToUpdate);
  };
  
  const handleDeleteProduct = async (productId: string) => {
    if (!user || !targetBrandId) return;
    const productRef = doc(db, 'brands', targetBrandId, 'products', productId);
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
          {(!isAdmin || !adminBrandId) && targetBrandId && (
            <CreateProductDialog onCreateProduct={handleCreateProduct}>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Product
              </Button>
            </CreateProductDialog>
          )}
        </header>
        {renderContent()}
      </div>
    </AppLayout>
  );
}

export default function ProductsPage() {
    return (
        <React.Suspense fallback={
            <div className="p-4 sm:p-6 lg:p-8 h-full">
                 <div className="space-y-4">
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-20" />
                        <Skeleton className="h-9 w-20" />
                        <Skeleton className="h-9 w-20" />
                    </div>
                    <Skeleton className="h-[400px] w-full" />
                </div>
            </div>
        }>
            <ProductsPageContent />
        </React.Suspense>
    );
}
