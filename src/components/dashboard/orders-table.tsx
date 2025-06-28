'use client';

import type { Order, OrderStatus } from '@/lib/types';
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
import { Truck, CheckCircle, XCircle, Clock, Archive, ChevronDown, ChevronRight, Trash2, AlertTriangle, Save } from 'lucide-react';
import * as React from 'react';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const statusConfig: Record<
  OrderStatus,
  { variant: 'default' | 'secondary' | 'destructive'; icon: React.ElementType; color: string }
> = {
  New: { variant: 'secondary', icon: Clock, color: 'text-muted-foreground' },
  Prepared: { variant: 'secondary', icon: Archive, color: 'text-primary' },
  Shipped: { variant: 'secondary', icon: Truck, color: 'text-primary' },
  Delivered: { variant: 'default', icon: CheckCircle, color: 'text-primary-foreground' },
  Cancelled: { variant: 'destructive', icon: XCircle, color: 'text-destructive-foreground' },
  Issue: { variant: 'secondary', icon: AlertTriangle, color: 'text-accent' },
};

const filterOptions: Array<OrderStatus | 'All'> = ['All', 'New', 'Prepared', 'Shipped', 'Delivered', 'Cancelled', 'Issue'];

interface OrdersTableProps {
    orders: Order[];
    isAdmin: boolean;
    onUpdateOrder: (order: Order) => void;
    onDeleteOrder: (orderId: string) => void;
    onAddNote: (orderId: string, noteContent: string) => void;
    onUpdateNoteResolved: (orderId: string, noteId: string, resolved: boolean) => void;
}

export function OrdersTable({ orders, isAdmin, onUpdateOrder, onDeleteOrder, onAddNote, onUpdateNoteResolved }: OrdersTableProps) {
  const [editableOrders, setEditableOrders] = React.useState<Record<string, Order>>({});
  const [expandedRows, setExpandedRows] = React.useState<string[]>([]);
  const [newNotes, setNewNotes] = React.useState<Record<string, string>>({});
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = React.useState<OrderStatus | 'All'>('New');

  React.useEffect(() => {
    // When orders prop changes, reset editable state
    setEditableOrders({});
  }, [orders]);
  
  const getOrderState = (orderId: string): Order => {
    return editableOrders[orderId] || orders.find(o => o.id === orderId)!;
  }

  const setOrderState = (order: Order) => {
    setEditableOrders(prev => ({ ...prev, [order.id]: order }));
  };

  const toggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
    // Remove pending edits if row is collapsed
    if (expandedRows.includes(id)) {
        setEditableOrders(prev => {
            const newState = {...prev};
            delete newState[id];
            return newState;
        });
    }
  };
  
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const order = getOrderState(orderId);
    setOrderState({ ...order, status: newStatus });
  };

  const handleNoteResolveChange = (orderId: string, noteId: string, resolved: boolean) => {
    onUpdateNoteResolved(orderId, noteId, resolved);
  };

  const handleAddNewNote = (orderId: string) => {
      const noteContent = newNotes[orderId]?.trim();
      if (!noteContent) return;

      onAddNote(orderId, noteContent);
      setNewNotes(prev => ({ ...prev, [orderId]: '' }));
  };

  const handleFieldChange = (orderId: string, field: 'shippingCompany' | 'driver', value: string) => {
    const order = getOrderState(orderId);
    setOrderState({ ...order, [field]: value });
  };

  const handleSaveChanges = (orderId: string) => {
    const orderToSave = editableOrders[orderId];
    if (orderToSave) {
        onUpdateOrder(orderToSave);
        toast({
            title: 'Changes Saved',
            description: `Your changes for order ${orderId} have been successfully saved.`,
        });
        setEditableOrders(prev => {
            const newState = {...prev};
            delete newState[orderId];
            return newState;
        });
    }
  };

  const handleDelete = (orderId: string) => {
    onDeleteOrder(orderId);
    toast({
        title: "Order Deleted",
        description: `Order ${orderId} has been deleted.`,
        variant: "destructive"
    });
  };

  const filteredOrders = React.useMemo(() => {
    if (activeFilter === 'All') {
      return orders;
    }
    return orders.filter((order) => order.status === activeFilter);
  }, [orders, activeFilter]);


  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4">
        {filterOptions.map((status) => (
          <Button
            key={status}
            variant={activeFilter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(status)}
          >
            {status}
          </Button>
        ))}
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 [&_th]:text-foreground">
                  <TableHead className="w-10" />
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (filteredOrders.map((baseOrder) => {
                  const order = getOrderState(baseOrder.id);
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
                        <TableCell>{order.customerPhone}</TableCell>
                        <TableCell>{order.destination}</TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={config.variant} className={cn("gap-1.5 pl-1.5", {
                                'bg-primary text-primary-foreground': order.status === 'Delivered',
                                'bg-destructive text-destructive-foreground': order.status === 'Cancelled',
                            })}>
                            <config.icon className={cn(`h-3.5 w-3.5 ${config.color}`, {
                                'text-primary-foreground': order.status === 'Delivered',
                                'text-destructive-foreground': order.status === 'Cancelled',
                            })} />
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow data-state="open">
                          <TableCell colSpan={7} className="p-0 bg-muted/20">
                            <div className="p-4 sm:p-6">
                              <Card className="shadow-none border-border/60">
                                <CardHeader className="flex flex-row items-center justify-between">
                                  <CardTitle>Order Details</CardTitle>
                                  {isAdmin && (
                                    <div className="flex items-center gap-2">
                                        <Button variant="default" size="sm" onClick={() => handleSaveChanges(order.id)}>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                              <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                  This action cannot be undone. This will permanently delete the order {order.id}.
                                                </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction 
                                                  onClick={() => handleDelete(order.id)}
                                                  className="bg-destructive hover:bg-destructive/90"
                                                >
                                                  Delete
                                                </AlertDialogAction>
                                              </AlertDialogFooter>
                                            </AlertDialogContent>
                                          </AlertDialog>
                                    </div>
                                  )}
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
                                    {isAdmin && (
                                      <>
                                        <Separator className="my-4" />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor={`shipping-company-${order.id}`} className="font-semibold">Shipping Company</Label>
                                                <Input
                                                    id={`shipping-company-${order.id}`}
                                                    value={order.shippingCompany || ''}
                                                    onChange={(e) => handleFieldChange(order.id, 'shippingCompany', e.target.value)}
                                                    placeholder="e.g., FedEx, UPS"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={`driver-${order.id}`} className="font-semibold">Driver / Delivery Person</Label>
                                                <Input
                                                    id={`driver-${order.id}`}
                                                    value={order.driver || ''}
                                                    onChange={(e) => handleFieldChange(order.id, 'driver', e.target.value)}
                                                    placeholder="e.g., John Smith"
                                                />
                                            </div>
                                        </div>
                                        <Separator className="my-4" />
                                          <div className="grid gap-4">
                                              <div>
                                                  <Label className="font-semibold">Update Status</Label>
                                                  <p className="text-sm text-muted-foreground">
                                                      Click to update the order status.
                                                  </p>
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
                                                      <AlertTriangle className="h-4 w-4 mr-2" />
                                                      Issue
                                                  </Button>
                                                  <Button
                                                      variant={order.status === 'Cancelled' ? 'destructive' : 'outline'}
                                                      size="sm"
                                                      onClick={() => handleStatusChange(order.id, 'Cancelled')}
                                                  >
                                                      <XCircle className="h-4 w-4 mr-2" />
                                                      Cancelled
                                                  </Button>
                                              </div>
                                          </div>
                                          <Separator className="my-4" />
                                          <div className="grid gap-4">
                                            <Label className="font-semibold">Notes</Label>
                                            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                                              {order.notes && order.notes.length > 0 ? (
                                                order.notes.map((note) => (
                                                  <div key={note.id} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-md border">
                                                    <Checkbox
                                                      id={`note-${order.id}-${note.id}`}
                                                      checked={note.resolved}
                                                      onCheckedChange={(checked) => handleNoteResolveChange(order.id, note.id, !!checked)}
                                                      className="mt-1"
                                                      aria-label={`Mark note as ${note.resolved ? 'unresolved' : 'resolved'}`}
                                                    />
                                                    <div className="grid gap-1.5 flex-1">
                                                      <Label
                                                        htmlFor={`note-${order.id}-${note.id}`}
                                                        className={cn("font-normal cursor-pointer", note.resolved && "line-through text-muted-foreground")}
                                                      >
                                                        {note.content}
                                                      </Label>
                                                      <p className="text-xs text-muted-foreground">
                                                        {new Date(note.date).toLocaleString()}
                                                      </p>
                                                    </div>
                                                  </div>
                                                ))
                                              ) : (
                                                <p className="text-sm text-muted-foreground text-center py-4">No notes for this order yet.</p>
                                              )}
                                            </div>
                                            <div className="grid gap-2">
                                              <Label htmlFor={`new-note-${order.id}`} className="sr-only">Add New Note</Label>
                                              <Textarea
                                                id={`new-note-${order.id}`}
                                                placeholder="Add a new note..."
                                                rows={2}
                                                className="text-sm"
                                                value={newNotes[order.id] || ''}
                                                onChange={(e) => setNewNotes(prev => ({...prev, [order.id]: e.target.value}))}
                                              />
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="justify-self-start"
                                                onClick={() => handleAddNewNote(order.id)}
                                                disabled={!newNotes[order.id]?.trim()}
                                              >
                                                Add Note
                                              </Button>
                                            </div>
                                          </div>
                                      </>
                                    )}
                                </CardContent>
                              </Card>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })) : (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                            No orders match the current filter.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
