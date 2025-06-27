import { OrdersTable } from "@/components/dashboard/orders-table";
import { ShippingSuggestionModal } from "@/components/dashboard/shipping-suggestion-modal";
import { Button } from "@/components/ui/button";
import { BrainCircuit } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold font-headline text-foreground">Orders</h1>
        </div>
        <ShippingSuggestionModal>
            <Button>
                <BrainCircuit className="mr-2 h-4 w-4" />
                Get Shipping Suggestion
            </Button>
        </ShippingSuggestionModal>
      </header>
      <OrdersTable />
    </div>
  );
}
