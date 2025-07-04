'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LogOut, Menu, Truck, Building } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';

export function NavBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { brand, isAdmin } = useAuth();
  
  const brandIdParam = searchParams.get('brandId');

  const menuItems = [
    { href: '/orders', label: 'Orders' },
    { href: '/products', label: 'Products' },
  ];

  const getHref = (baseHref: string) => {
    return brandIdParam ? `${baseHref}?brandId=${brandIdParam}` : baseHref;
  };

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
        await signOut(auth);
        toast({ title: "Logged Out", description: "You have been successfully logged out." });
    } catch (error) {
        toast({
            title: "Logout Failed",
            description: "An error occurred during logout. Please try again.",
            variant: "destructive",
        });
    }
  };


  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href={isAdmin && !brandIdParam ? "/admin/brands" : "/orders"}
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          {brand?.logo && !brandIdParam ? (
             <Avatar className="h-6 w-6">
                <AvatarImage src={brand.logo} alt={brand.name} />
                <AvatarFallback>{brand.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : (
            <Truck className="h-6 w-6 text-primary" />
          )}

          <span className="font-headline font-bold">{brand?.name && !brandIdParam ? brand.name : 'Rabit'}</span>
        </Link>
        {menuItems.map((item) => (
           <Link
            key={item.href}
            href={getHref(item.href)}
            className={cn(
              "transition-colors hover:text-foreground",
              isActive(item.href) ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
        {isAdmin && (
            <Link
                href="/admin/brands"
                className={cn(
                  "flex items-center gap-2 transition-colors hover:text-foreground",
                  isActive('/admin/brands') ? "text-foreground" : "text-muted-foreground"
                )}
            >
                <Building className="h-4 w-4" />
                Brands Admin
            </Link>
        )}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href={isAdmin ? "/admin/brands" : "/orders"}
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Truck className="h-6 w-6 text-primary" />
              <span className="font-headline font-bold">{brand?.name || 'Rabit'}</span>
            </Link>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={getHref(item.href)}
                className={cn(
                  "hover:text-foreground",
                  isActive(item.href) ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
             {isAdmin && (
                <Link
                    href="/admin/brands"
                    className={cn(
                      "flex items-center gap-2 transition-colors hover:text-foreground",
                      isActive('/admin/brands') ? "text-foreground" : "text-muted-foreground"
                    )}
                >
                    <Building className="h-5 w-5" />
                    Brands Admin
                </Link>
            )}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        {isAdmin && brandIdParam && <Badge variant="outline">Admin View</Badge>}
        <Button onClick={handleLogout} variant="ghost" className="hover:bg-primary hover:text-primary-foreground">
          <LogOut />
          Log Out
        </Button>
      </div>
    </header>
  );
}
