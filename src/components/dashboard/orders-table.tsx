'use client';

import { mockOrders } from '@/lib/data';
import type { OrderStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Truck, CheckCircle, XCircle, Clock, Archive, ChevronDown, ChevronRight, Edit, Trash2 } from 'lucide-react';
import * as React from 'react';

const statusConfig: Record<
  OrderStatus,
  { variant: 'default' | 'secondary' | 'destructive'; icon: React.ElementType; color: string }
> = {
  Pending: { variant: 'secondary', icon: Clock, color: 'text-accent' },
  Processing: { variant: 'secondary', icon: Archive, color: 'text-blue-400' },
  Shipped: { variant: 'secondary', icon: Truck, color: 'text-primary' },
  Delivered: { variant: 'default', icon: CheckCircle, color: 'text-green-500' },
  Cancelled: { variant: 'destructive', icon: XCircle, color: 'text-destructive' },
};

export function OrdersTable() {
  const [expandedRows, setExpandedRows] = React.useState<string[]>([]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10" />
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map((order) => {
                const config = statusConfig[order.status];
                const isExpanded = expandedRows.includes(order.id);
                return (
                  <React.Fragment key={order.id}>
                    <TableRow
                      onClick={() => toggleRow(order.id)}
                      className="cursor-pointer"
                      data-state={isExpanded ? 'open' : 'closed'}
                    >
                      <TableCell className="px-2">
                        {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                      </TableCell>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{order.destination}</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={config.variant} className="gap-1.5 pl-1.5">
                          <config.icon className={`h-3.5 w-3.5 ${config.color}`} />
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow data-state="open">
                        <TableCell colSpan={6} className="p-0 bg-muted/20">
                           <div className="p-4 sm:p-6">
                             <Card className="shadow-none border-border/60">
                               <CardHeader className="flex flex-row items-center justify-between">
                                 <CardTitle>Order Details</CardTitle>
                                 <div className="flex items-center gap-2">
                                     <Button variant="outline" size="sm">
                                         <Edit className="mr-2 h-3.5 w-3.5" />
                                         Edit Order
                                     </Button>
                                     <Button variant="destructive" size="sm">
                                         <Trash2 className="mr-2 h-3.5 w-3.5" />
                                         Delete Order
                                     </Button>
                                 </div>
                               </CardHeader>
                               <CardContent>
                                  <ul className="space-y-2 text-sm">
                                    {order.items.map((item) => (
                                       <li key={item.product.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                          <div>
                                            <span className="font-semibold">{item.product.name}</span>
                                            <span className="text-muted-foreground ml-2">(SKU: {item.product.sku})</span>
                                          </div>
                                          <span className="font-medium text-foreground">Qty: {item.quantity}</span>
                                       </li>
                                    ))}
                                  </ul>
                               </CardContent>
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
