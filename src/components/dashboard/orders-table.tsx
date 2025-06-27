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
import { Truck, CheckCircle, XCircle, Clock, Archive, ChevronDown, ChevronRight, Edit, Trash2, AlertTriangle } from 'lucide-react';
import * as React from 'react';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

const statusConfig: Record<
  OrderStatus,
  { variant: 'default' | 'secondary' | 'destructive'; icon: React.ElementType; color: string }
> = {
  New: { variant: 'secondary', icon: Clock, color: 'text-muted-foreground' },
  Prepared: { variant: 'secondary', icon: Archive, color: 'text-primary' },
  Shipped: { variant: 'secondary', icon: Truck, color: 'text-primary' },
  Delivered: { variant: 'default', icon: CheckCircle, color: 'text-[hsl(var(--chart-2))]' },
  Cancelled: { variant: 'destructive', icon: XCircle, color: 'text-destructive' },
  Issue: { variant: 'secondary', icon: AlertTriangle, color: 'text-accent' },
};

export function OrdersTable() {
  const [orders, setOrders] = React.useState(mockOrders);
  const [expandedRows, setExpandedRows] = React.useState<string[]>([]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };
  
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(currentOrders =>
      currentOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
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
              {orders.map((order) => {
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
                                  <Separator className="my-4" />
                                    <div className="grid gap-4">
                                        <div>
                                            <Label className="font-semibold">Update Status</Label>
                                            <p className="text-sm text-muted-foreground">Click to update the order status.</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {(['New', 'Prepared', 'Shipped', 'Delivered'] as OrderStatus[]).map((status) => (
                                                <Button
                                                    key={status}
                                                    variant={order.status === status ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => handleStatusChange(order.id, status)}
                                                >
                                                    {status}
                                                </Button>
                                            ))}
                                            <Button
                                                variant='outline'
                                                className={cn(order.status === 'Issue' && 'bg-accent text-accent-foreground hover:bg-accent/90')}
                                                size="sm"
                                                onClick={() => handleStatusChange(order.id, 'Issue')}
                                            >
                                                <AlertTriangle className="mr-2 h-3.5 w-3.5" />
                                                Issue
                                            </Button>
                                            <Button
                                                variant={order.status === 'Cancelled' ? 'destructive' : 'outline'}
                                                size="sm"
                                                onClick={() => handleStatusChange(order.id, 'Cancelled')}
                                            >
                                                <XCircle className="mr-2 h-3.5 w-3.5" />
                                                Cancelled
                                            </Button>
                                        </div>
                                    </div>
                                    <Separator className="my-4" />
                                    <div className="grid gap-2">
                                        <Label htmlFor={`notes-${order.id}`} className="font-semibold">Notes</Label>
                                        <Textarea
                                            id={`notes-${order.id}`}
                                            placeholder="Add a note for this order..."
                                            defaultValue={order.notes}
                                            rows={3}
                                            className="text-sm"
                                        />
                                        <Button variant="outline" size="sm" className="justify-self-start">
                                            Save Note
                                        </Button>
                                    </div>
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
