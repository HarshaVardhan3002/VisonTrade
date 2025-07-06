'use server';
/**
 * @fileOverview AI-powered stock information generator.
 *
 * - getStockInfo - A function that gets a summary and suggestion for a stock.
 */

import {ai} from '@/ai/genkit';
import {
  StockInfoInputSchema,
  StockInfoOutputSchema,
  type StockInfoInput,
  type StockInfoOutput,
} from '@/ai/schemas';

export async function getStockInfo(
  input: StockInfoInput
): Promise<StockInfoOutput> {
  // In a real app, you might use a tool to fetch real-time stock data here.
  // For this MVP, we rely on the model's knowledge.
  return getStockInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'stockInfoPrompt',
  input: {schema: StockInfoInputSchema},
  output: {schema: StockInfoOutputSchema},
  prompt: `You are an expert financial analyst. Provide a concise analysis for the stock with the ticker symbol: {{{stockSymbol}}}.

  Your analysis should include:
  1.  A brief summary of the company and its recent performance.
  2.  A clear "BUY", "HOLD", or "SELL" recommendation.
  3.  A short paragraph explaining the reasoning for your recommendation.

  Generate a plausible but fictional analysis based on the stock symbol provided. Do not use real-time data.`,
});

const getStockInfoFlow = ai.defineFlow(
  {
    name: 'getStockInfoFlow',
    inputSchema: StockInfoInputSchema,
    outputSchema: StockInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
