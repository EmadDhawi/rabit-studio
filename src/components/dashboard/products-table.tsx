'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Pencil, ChevronDown, ChevronRight, Save, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Product } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface ProductsTableProps {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export function ProductsTable({ products, onUpdateProduct, onDeleteProduct }: ProductsTableProps) {
  const [expandedRows, setExpandedRows] = React.useState<string[]>([]);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const { toast } = useToast();

  const toggleRow = (product: Product) => {
    const productId = product.id;
    const isCurrentlyExpanded = expandedRows.includes(productId);

    if (isCurrentlyExpanded) {
      setExpandedRows([]);
      setEditingProduct(null);
    } else {
      setExpandedRows([productId]);
      setEditingProduct({ ...product });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProduct) return;
    const { name, value } = e.target;
    
    setEditingProduct({ 
        ...editingProduct, 
        [name]: name === 'quantity' ? parseInt(value, 10) || 0 : value 
    });
  };
  
  const handleActiveSwitchChange = (checked: boolean) => {
    if (!editingProduct) return;
    setEditingProduct({ ...editingProduct, active: checked });
  };

  const handleDeleteSwitchChange = (checked: boolean) => {
    if (!editingProduct) return;
    setEditingProduct({ ...editingProduct, deleted: checked });
  };

  const handleSaveChanges = () => {
    if (!editingProduct) return;
    onUpdateProduct(editingProduct);
    toast({ title: "Product Updated", description: `"${editingProduct.name}" has been successfully updated.` });
    setExpandedRows([]);
    setEditingProduct(null);
  };
  
  const handleCancel = () => {
    setExpandedRows([]);
    setEditingProduct(null);
  };

  const visibleProducts = products.filter(p => !p.deleted);

  if (visibleProducts.length === 0) {
    return (
        <Card className="flex flex-col items-center justify-center text-center text-muted-foreground p-12">
            <p>No products found. Get started by creating a new product.</p>
        </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50 [&_th]:text-foreground">
                <TableHead className="w-12" />
                <TableHead className="w-24">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleProducts.map((product) => {
                const isExpanded = expandedRows.includes(product.id);
                return (
                <React.Fragment key={product.id}>
                  <TableRow 
                    onClick={() => toggleRow(product)} 
                    className="cursor-pointer"
                    data-state={isExpanded ? 'open' : 'closed'}
                  >
                    <TableCell className="px-2">
                        {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    </TableCell>
                    <TableCell>
                      <Image
                        src={product.imageUrl || 'https://placehold.co/80x80.png'}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                        data-ai-hint="product photo"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                    <TableCell>{(product.quantity ?? 0) > 0 ? product.quantity : <span className="text-destructive">Out of stock</span>}</TableCell>
                    <TableCell>
                      <Badge variant={product.active ? 'default' : 'secondary'} className={product.active ? 'bg-primary/20 text-primary-foreground border-primary/30' : ''}>
                        {product.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  {isExpanded && editingProduct && editingProduct.id === product.id && (
                    <TableRow data-state="open">
                      <TableCell colSpan={6} className="p-0 bg-muted/20">
                        <div className="p-4 sm:p-6">
                            <Card className="shadow-none border-border/60">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Pencil /> Edit Product
                                    </CardTitle>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                                          <Trash2 />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the product "{product.name}".
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction 
                                            onClick={() => onDeleteProduct(product.id)}
                                            className="bg-destructive hover:bg-destructive/90"
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="grid gap-2">
                                        <Label htmlFor={`name-${product.id}`}>Product Name</Label>
                                        <Input id={`name-${product.id}`} name="name" value={editingProduct.name} onChange={handleInputChange} />
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor={`sku-${product.id}`}>SKU</Label>
                                        <Input id={`sku-${product.id}`} name="sku" value={editingProduct.sku} onChange={handleInputChange} />
                                      </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor={`quantity-${product.id}`}>Quantity</Label>
                                      <Input id={`quantity-${product.id}`} name="quantity" type="number" value={editingProduct.quantity ?? ''} onChange={handleInputChange} />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor={`imageUrl-${product.id}`}>Image URL</Label>
                                      <Input id={`imageUrl-${product.id}`} name="imageUrl" value={editingProduct.imageUrl ?? ''} onChange={handleInputChange} />
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                      <div className="space-y-0.5">
                                        <Label htmlFor={`active-${product.id}`} className="cursor-pointer">Active</Label>
                                        <p className="text-sm text-muted-foreground">Make the product available for purchase.</p>
                                      </div>
                                      <Switch id={`active-${product.id}`} checked={editingProduct.active ?? false} onCheckedChange={handleActiveSwitchChange} />
                                  </div>
                                   <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-3 shadow-sm">
                                      <div className="space-y-0.5">
                                        <Label htmlFor={`deleted-${product.id}`} className="cursor-pointer text-destructive">Delete</Label>
                                        <p className="text-sm text-muted-foreground">Mark this product for deletion. It will be hidden from the list.</p>
                                      </div>
                                      <Switch id={`deleted-${product.id}`} checked={editingProduct.deleted ?? false} onCheckedChange={handleDeleteSwitchChange} />
                                   </div>
                                </CardContent>
                                <CardFooter className="justify-end gap-2 pt-6">
                                  <Button variant="outline" onClick={handleCancel}>
                                    <X className="mr-2 h-4 w-4" />
                                    Cancel
                                  </Button>
                                  <Button onClick={handleSaveChanges}>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                  </Button>
                                </CardFooter>
                            </Card>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
