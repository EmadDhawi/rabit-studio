'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Home, LogOut, Package, Settings, Truck, Users, Warehouse } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';

export function SidebarNav() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/orders', label: 'Orders', icon: Package },
    { href: '/dashboard/products', label: 'Products', icon: Warehouse },
    { href: '/dashboard/admin', label: 'Admin', icon: Users },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-headline font-bold text-sidebar-foreground">Rabit</span>
          </div>
        </SidebarHeader>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={{ children: item.label, side: 'right' }}>
                  <Link href={item.href}>
                    <item.icon />
                    {item.label}
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="flex items-center gap-3 w-full">
          <Avatar className="size-8">
            <AvatarImage src="https://placehold.co/40x40" alt="User" data-ai-hint="person user" />
            <AvatarFallback>BO</AvatarFallback>
          </Avatar>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden transition-opacity duration-200 flex-1">
            <span className="font-semibold text-sm text-sidebar-foreground">Brand Owner</span>
            <span className="text-xs text-sidebar-foreground/70">owner@brand.com</span>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
             <SidebarMenuButton asChild tooltip={{ children: 'Settings', side: 'right' }}>
                <Link href="/dashboard/settings">
                  <Settings /> Settings
                </Link>
              </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <SidebarMenuButton asChild tooltip={{ children: 'Log Out', side: 'right' }} variant="outline">
                <Link href="/">
                  <LogOut /> Log Out
                </Link>
              </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
