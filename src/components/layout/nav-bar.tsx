'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LogOut, Menu, Truck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export function NavBar() {
  const pathname = usePathname();
  const { toast } = useToast();

  const menuItems = [
    { href: '/orders', label: 'Orders' },
    { href: '/products', label: 'Products' },
  ];

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
        await signOut(auth);
        // AuthProvider will handle redirect
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
          href="/orders"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Truck className="h-6 w-6 text-primary" />
          <span className="font-headline font-bold">Rabit</span>
        </Link>
        {menuItems.map((item) => (
           <Link
            key={item.href}
            href={item.href}
            className={cn(
              "transition-colors hover:text-foreground",
              isActive(item.href) ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
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
              href="/orders"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Truck className="h-6 w-6 text-primary" />
              <span className="font-headline font-bold">Rabit</span>
            </Link>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "hover:text-foreground",
                  isActive(item.href) ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <Button onClick={handleLogout} variant="ghost" className="hover:bg-primary hover:text-primary-foreground">
          <LogOut />
          Log Out
        </Button>
      </div>
    </header>
  );
}
