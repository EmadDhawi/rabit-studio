'use client';

import * as React from 'react';
import AppLayout from '@/components/layout/app-layout';
import { Button } from "@/components/ui/button";
import { ProductsTable } from "@/components/dashboard/products-table";
import { PlusCircle } from "lucide-react";
import { CreateProductDialog } from '@/components/dashboard/create-product-dialog';
import { mockProducts } from '@/lib/data';
import type { Product } from '@/lib/types';

export default function ProductsPage() {
  const [products, setProducts] = React.useState<Product[]>(mockProducts);

  const handleCreateProduct = (newProduct: Omit<Product, 'id'>) => {
    setProducts(prev => [
      { ...newProduct, id: `P${Date.now()}` },
      ...prev,
    ]);
  };
  
  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };
  
  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
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
        <ProductsTable 
          products={products}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      </div>
    </AppLayout>
  );
}
