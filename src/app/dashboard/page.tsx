import { Button } from '@/components/ui/button';
import { OrdersTable } from '@/components/dashboard/orders-table';
import { Download, PlusCircle, BrainCircuit } from 'lucide-react';
import { ShippingSuggestionModal } from '@/components/dashboard/shipping-suggestion-modal';

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold font-headline text-foreground">Orders</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <ShippingSuggestionModal>
            <Button variant="outline">
                <BrainCircuit className="mr-2 h-4 w-4" />
                Smart Suggestion
            </Button>
          </ShippingSuggestionModal>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Order
          </Button>
        </div>
      </header>
      <OrdersTable />
    </div>
  );
}
