'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
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
import { Building } from 'lucide-react';

const brandSchema = z.object({
  name: z.string().min(2, { message: "Brand name must be at least 2 characters." }),
  logo: z.string().url({ message: "Please enter a valid URL for the logo." }).optional().or(z.literal('')),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
});

type BrandFormValues = z.infer<typeof brandSchema>;

export default function CreateBrandPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: '',
      logo: '',
      phone: '',
    },
  });

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
            owner: user.uid,
            active: true,
            deleted: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        toast({ title: "Brand Created!", description: "Your brand has been successfully created." });
        router.push('/orders');
    } catch (error) {
        console.error("Failed to create brand:", error);
        toast({ title: "Error", description: "Failed to create brand. Please try again.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sidebar-background">
                <Building className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground font-headline">Create Your Brand</h1>
            <p className="mt-2 text-muted-foreground">Tell us a bit about your business to get started.</p>
        </div>
        <Card className="w-full bg-card/80 backdrop-blur-sm border-border/50">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">Brand Details</CardTitle>
                    <CardDescription>
                        This information will be used to identify your business across the app.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Brand Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Acme Co." {...field} disabled={isSubmitting}/>
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
                                <Input placeholder="e.g., (123) 456-7890" {...field} disabled={isSubmitting}/>
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
                                <Input placeholder="https://your-domain.com/logo.png" {...field} disabled={isSubmitting}/>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Brand and Continue"}
                    </Button>
                </CardFooter>
            </form>
            </Form>
        </Card>
      </div>
    </div>
  );
}
