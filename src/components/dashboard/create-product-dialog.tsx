'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from '@/components/ui/switch';
import type { Product } from '@/lib/types';
import { PlusCircle, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  sku: z.string().min(3, "SKU must be at least 3 characters."),
  quantity: z.coerce.number().int().min(0, "Quantity cannot be negative."),
  imageUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  active: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface CreateProductDialogProps {
  children: React.ReactNode;
  productToEdit?: Product;
  onCreateProduct?: (product: Omit<Product, 'id' | 'brandId'>) => void;
  onUpdateProduct?: (product: Product) => void;
}

export function CreateProductDialog({ children, productToEdit, onCreateProduct, onUpdateProduct }: CreateProductDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const isEditMode = !!productToEdit;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sku: '',
      quantity: 0,
      imageUrl: '',
      active: true,
    },
  });

  React.useEffect(() => {
    if (open && productToEdit) {
      form.reset({
        name: productToEdit.name,
        sku: productToEdit.sku,
        quantity: productToEdit.quantity,
        imageUrl: productToEdit.imageUrl,
        active: productToEdit.active,
      });
    } else if (open) {
        form.reset({
            name: '',
            sku: '',
            quantity: 0,
            imageUrl: '',
            active: true,
        });
    }
  }, [open, productToEdit, form]);

  const onSubmit = (data: ProductFormValues) => {
    const productData = { ...data, imageUrl: data.imageUrl || 'https://placehold.co/80x80.png' };
    
    if (isEditMode && onUpdateProduct && productToEdit) {
        onUpdateProduct({ ...productToEdit, ...productData });
        toast({ title: "Product Updated", description: `"${data.name}" has been successfully updated.` });
    } else if (onCreateProduct) {
        onCreateProduct(productData);
        toast({ title: "Product Created", description: `"${data.name}" has been successfully created.` });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditMode ? <Pencil /> : <PlusCircle />}
            {isEditMode ? 'Edit Product' : 'Create New Product'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the details for this product." : "Fill in the details for the new product."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Classic T-Shirt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., TS-01-BLK" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://placehold.co/80x80.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Active</FormLabel>
                    <p className="text-sm text-muted-foreground">
                        Make the product available for purchase.
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">{isEditMode ? 'Save Changes' : 'Create Product'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
