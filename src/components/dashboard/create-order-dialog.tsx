'use client';

import * as React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Order, Product, OrderItem } from '@/lib/types';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const orderItemSchema = z.object({
  productId: z.string().min(1, "Please select a product."),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1."),
});

const orderSchema = z.object({
  customerName: z.string().min(3, "Customer name must be at least 3 characters."),
  customerPhone: z.string().min(10, "Please enter a valid phone number."),
  destination: z.string().min(5, "Destination must be at least 5 characters."),
  items: z.array(orderItemSchema).min(1, "Please add at least one item to the order."),
});

type OrderFormValues = z.infer<typeof orderSchema>;

interface CreateOrderDialogProps {
  children: React.ReactNode;
  products: Product[];
  onCreateOrder: (order: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'shippedAt'>) => Promise<void>;
}

export function CreateOrderDialog({ children, products, onCreateOrder }: CreateOrderDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      destination: '',
      items: [{ productId: '', quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  React.useEffect(() => {
    if (!open) {
      form.reset({
        customerName: '',
        customerPhone: '',
        destination: '',
        items: [{ productId: '', quantity: 1 }],
      });
      setIsSubmitting(false);
    }
  }, [open, form]);

  const onSubmit = async (data: OrderFormValues) => {
    setIsSubmitting(true);
    try {
      const orderItems: OrderItem[] = data.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) throw new Error("Invalid product selected"); // Should not happen with validation
        return { product, quantity: item.quantity };
      });

      const newOrderData = {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        destination: data.destination,
        items: orderItems,
        notes: [],
      };
      
      await onCreateOrder(newOrderData);
      toast({ title: "Order Created", description: `A new order for ${data.customerName} has been successfully created.` });
      setOpen(false);
    } catch (error) {
      console.error("Failed to create order:", error);
      toast({
          title: "Error",
          description: "Failed to create the order. Please try again.",
          variant: "destructive",
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlusCircle />
            Create New Order
          </DialogTitle>
          <DialogDescription>
            Fill in the details to create a new shipping order.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[60vh]">
                <div className="space-y-4 p-4 pr-6">
                    <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Customer Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., John Doe" {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                        control={form.control}
                        name="customerPhone"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Customer Phone</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., 123-456-7890" {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="destination"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Destination</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., New York, USA" {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>

                    <Separator className="my-6" />

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium">Order Items</h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ productId: '', quantity: 1 })}
                                disabled={isSubmitting}
                            >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Item
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex items-end gap-2 p-4 border rounded-md">
                                    <Controller
                                        name={`items.${index}.productId`}
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Product</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a product" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {products.filter(p => p.active).map(product => (
                                                            <SelectItem key={product.id} value={product.id}>
                                                                {product.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.quantity`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Quantity</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="1" {...field} className="w-24" disabled={isSubmitting} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {fields.length > 1 && (
                                    <Button type="button" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => remove(index)} disabled={isSubmitting}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                         {form.formState.errors.items && (
                            <p className="text-sm font-medium text-destructive mt-2">
                                {form.formState.errors.items.message || form.formState.errors.items.root?.message}
                            </p>
                        )}
                    </div>
                </div>
            </ScrollArea>
            <DialogFooter className="pt-6 border-t mt-4">
                <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Order'}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
