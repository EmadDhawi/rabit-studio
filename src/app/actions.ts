'use server';

import { suggestShippingCompanies } from '@/ai/flows/shipping-suggestion';
import type { SuggestShippingCompaniesOutput } from '@/ai/flows/shipping-suggestion';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const ActionInputSchema = z.object({
  orderDetails: z.string().min(10, { message: 'Order details must be at least 10 characters long.' }),
  pastPerformanceData: z.string().min(10, { message: 'Performance data must be at least 10 characters long.' })
});

type SuggestionState = {
  message: string;
  suggestions?: SuggestShippingCompaniesOutput;
  errors?: {
    orderDetails?: string[];
    pastPerformanceData?: string[];
  };
  formKey: number;
};

export async function getShippingSuggestion(
  prevState: SuggestionState,
  formData: FormData
): Promise<SuggestionState> {
  const rawData = {
    orderDetails: formData.get('orderDetails'),
    pastPerformanceData: formData.get('pastPerformanceData'),
  };

  const validatedFields = ActionInputSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: 'Invalid input.',
      errors: validatedFields.error.flatten().fieldErrors,
      formKey: prevState.formKey,
    };
  }
  
  try {
    const result = await suggestShippingCompanies(validatedFields.data);
    revalidatePath('/dashboard');
    return { message: 'Success', suggestions: result, formKey: prevState.formKey + 1 };
  } catch (error) {
    console.error(error);
    return { message: 'Failed to get suggestions from AI.', errors: undefined, formKey: prevState.formKey };
  }
}
