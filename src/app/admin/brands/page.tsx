'use client';

import * as React from 'react';
import AppLayout from '@/components/layout/app-layout';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import type { Brand } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import Image from 'next/image';
import { Building, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateBrandDialog } from '@/components/admin/create-brand-dialog';

export default function AdminBrandsPage() {
    const [brands, setBrands] = React.useState<Brand[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const q = query(collection(db, 'brands'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const brandsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Brand));
            setBrands(brandsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching brands: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Skeleton className="h-12 w-12 rounded-md" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )
        }
        
        if (brands.length === 0) {
            return <p className="text-center text-muted-foreground">No brands found.</p>
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brands.map((brand) => (
                    <Link href={`/orders?brandId=${brand.id}`} key={brand.id}>
                        <Card className="h-full hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Image 
                                    src={brand.logo || 'https://placehold.co/100x100.png'} 
                                    alt={`${brand.name} logo`} 
                                    width={48} 
                                    height={48} 
                                    className="rounded-md object-cover"
                                    data-ai-hint="logo"
                                />
                                <div>
                                    <CardTitle className="text-xl">{brand.name}</CardTitle>
                                    <CardDescription>{brand.phone}</CardDescription>
                                </div>
                            </CardHeader>
                             <CardContent>
                                <p className="text-sm text-muted-foreground">Owner UID: {brand.owner}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        )
    }

    return (
        <AppLayout>
            <div className="p-4 sm:p-6 lg:p-8 h-full">
                <header className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Building className="h-8 w-8" />
                        <h1 className="text-3xl font-bold font-headline text-foreground">All Brands</h1>
                    </div>
                    <CreateBrandDialog>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New Brand
                        </Button>
                    </CreateBrandDialog>
                </header>
                {renderContent()}
            </div>
        </AppLayout>
    );
}
