'use server';

/**
 * @fileOverview An AI agent that suggests shipping companies based on order details and past performance data.
 *
 * - suggestShippingCompanies - A function that suggests shipping companies.
 * - SuggestShippingCompaniesInput - The input type for the suggestShippingCompanies function.
 * - SuggestShippingCompaniesOutput - The return type for the suggestShippingCompanies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestShippingCompaniesInputSchema = z.object({
  orderDetails: z
    .string()
    .describe('The details of the order, including products, quantities, and destination.'),
  pastPerformanceData: z
    .string()
    .describe(
      'Data on past shipping performance, including shipping times, costs, and reliability for different carriers.'
    ),
});
export type SuggestShippingCompaniesInput = z.infer<
  typeof SuggestShippingCompaniesInputSchema
>;

const SuggestShippingCompaniesOutputSchema = z.object({
  suggestedCompanies: z
    .array(z.string())
    .describe('A list of suggested shipping companies.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the shipping company suggestions.'),
});
export type SuggestShippingCompaniesOutput = z.infer<
  typeof SuggestShippingCompaniesOutputSchema
>;

export async function suggestShippingCompanies(
  input: SuggestShippingCompaniesInput
): Promise<SuggestShippingCompaniesOutput> {
  return suggestShippingCompaniesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestShippingCompaniesPrompt',
  input: {schema: SuggestShippingCompaniesInputSchema},
  output: {schema: SuggestShippingCompaniesOutputSchema},
  prompt: `You are an expert logistics consultant. Given the following order details and past performance data, suggest the best shipping companies for this order.

Order Details: {{{orderDetails}}}
Past Performance Data: {{{pastPerformanceData}}}

Consider factors such as shipping time, cost, reliability, and any other relevant information.

Output the list of suggested companies and reasoning.`,
});

const suggestShippingCompaniesFlow = ai.defineFlow(
  {
    name: 'suggestShippingCompaniesFlow',
    inputSchema: SuggestShippingCompaniesInputSchema,
    outputSchema: SuggestShippingCompaniesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
