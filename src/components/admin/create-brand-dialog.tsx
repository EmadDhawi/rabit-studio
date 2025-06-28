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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { PlusCircle } from 'lucide-react';

const brandSchema = z.object({
  name: z.string().min(2, { message: "Brand name must be at least 2 characters." }),
  logo: z.string().url({ message: "Please enter a valid URL for the logo." }).optional().or(z.literal('')),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  owner: z.string().min(1, { message: "Owner UID is required." }),
});

type BrandFormValues = z.infer<typeof brandSchema>;

interface CreateBrandDialogProps {
  children: React.ReactNode;
}

export function CreateBrandDialog({ children }: CreateBrandDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: '',
      logo: '',
      phone: '',
      owner: '',
    },
  });

  React.useEffect(() => {
    if (!open) {
      form.reset();
      setIsSubmitting(false);
    }
  }, [open, form]);

  const onSubmit = async (data: BrandFormValues) => {
    if (!user) {
        toast({ title: "Error", description: "You must be logged in to create a brand.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    try {
        await addDoc(collection(db, 'brands'), {
            name: data.name,
            logo: data.logo || `https://placehold.co/100x100.png?text=${data.name.charAt(0)}`,
            phone: data.phone,
            owner: data.owner,
            active: true,
            deleted: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        toast({ title: "Brand Created!", description: "The brand has been successfully created." });
        setOpen(false);
    } catch (error) {
        console.error("Failed to create brand:", error);
        toast({ title: "Error", description: "Failed to create brand. Please try again.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlusCircle />
            Create New Brand
          </DialogTitle>
          <DialogDescription>
            Fill in the details for the new brand.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Acme Co." {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., (123) 456-7890" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://your-domain.com/logo.png" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="owner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner User ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Firebase User ID of the brand owner" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormDescription>
                    This can be found in the Firebase Authentication console.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Brand'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
