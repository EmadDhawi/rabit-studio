'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LogOut, Menu, Truck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function SidebarNav() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/orders', label: 'Orders' },
    { href: '/products', label: 'Products' },
  ];

  const isActive = (href: string) => {
    return pathname.startsWith(href);
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
        <Button asChild variant="ghost" className="hover:bg-primary hover:text-primary-foreground">
          <Link href="/">
            <LogOut />
            Log Out
          </Link>
        </Button>
      </div>
    </header>
  );
}
