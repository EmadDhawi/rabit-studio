'use client';

import { getShippingSuggestion } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BrainCircuit, Lightbulb, Loader2, ThumbsUp } from 'lucide-react';
import * as React from 'react';
import { useFormState, useFormStatus } from 'react-dom';

const initialState = {
  message: '',
  suggestions: undefined,
  errors: undefined,
  formKey: 0,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
            {pending ? "Analyzing..." : "Get Suggestions"}
        </Button>
    )
}


export function ShippingSuggestionModal({ children }: { children: React.ReactNode }) {
  const [state, formAction] = useFormState(getShippingSuggestion, initialState);
  const [open, setOpen] = React.useState(false);
  
  React.useEffect(() => {
    if (state.message === 'Success' && state.suggestions) {
      // Form was successful, but we don't close the dialog.
      // The user can view results and close manually.
    }
  }, [state]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset state when dialog is closed
      state.message = '';
      state.suggestions = undefined;
      state.errors = undefined;
    }
    setOpen(isOpen);
  };


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline">
            <BrainCircuit /> Smart Shipping Suggestion
          </DialogTitle>
          <DialogDescription>
            Provide order details and past performance data to get AI-powered shipping carrier recommendations.
          </DialogDescription>
        </DialogHeader>

        {state.suggestions ? (
             <div className="space-y-4 p-4 bg-secondary/50 rounded-lg border">
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2"><ThumbsUp className="text-primary"/> Recommendations</h3>
                <div className="space-y-2">
                    <p className="font-semibold">Suggested Companies:</p>
                    <div className="flex flex-wrap gap-2">
                        {state.suggestions.suggestedCompanies.map((company) => (
                            <span key={company} className="px-3 py-1 bg-primary/20 text-primary-foreground rounded-full text-sm font-medium">{company}</span>
                        ))}
                    </div>
                </div>
                 <div className="space-y-2">
                    <p className="font-semibold">Reasoning:</p>
                    <p className="text-muted-foreground text-sm">{state.suggestions.reasoning}</p>
                </div>
                 <Button onClick={() => handleOpenChange(false)} className="mt-4">Close</Button>
            </div>
        ) : (
            <form action={formAction} key={state.formKey} className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="orderDetails">Order Details</Label>
                    <Textarea 
                        id="orderDetails" 
                        name="orderDetails" 
                        placeholder="e.g., 5 T-shirts, 2 Mugs, shipping to 123 Main St, New York, NY. Fragile items." 
                        required 
                        rows={4}
                    />
                    {state.errors?.orderDetails && <p className="text-sm text-destructive">{state.errors.orderDetails[0]}</p>}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="pastPerformanceData">Past Performance Data</Label>
                    <Textarea 
                        id="pastPerformanceData" 
                        name="pastPerformanceData"
                        placeholder="e.g., Carrier A: 2-day avg delivery, $10 avg cost. Carrier B: 3-day avg delivery, $8 avg cost, 1% damage rate."
                        required
                        rows={4}
                    />
                    {state.errors?.pastPerformanceData && <p className="text-sm text-destructive">{state.errors.pastPerformanceData[0]}</p>}
                </div>
                <DialogFooter>
                    <SubmitButton />
                </DialogFooter>
            </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
