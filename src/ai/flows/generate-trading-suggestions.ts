// src/ai/flows/generate-trading-suggestions.ts
'use server';

/**
 * @fileOverview AI-powered trading suggestion generator based on user data and market conditions.
 *
 * - generateTradingSuggestions - A function that generates personalized trading suggestions.
 */

import {ai} from '@/ai/genkit';
import {
  TradingSuggestionsInputSchema,
  TradingSuggestionsOutputSchema,
  type TradingSuggestionsInput,
  type TradingSuggestionsOutput,
} from '@/ai/schemas';

export async function generateTradingSuggestions(
  input: TradingSuggestionsInput
): Promise<TradingSuggestionsOutput> {
  return generateTradingSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tradingSuggestionsPrompt',
  input: {schema: TradingSuggestionsInputSchema},
  output: {schema: TradingSuggestionsOutputSchema},
  prompt: `You are an AI trading assistant that provides personalized trading suggestions based on the users trading history, risk tolerance, and current market conditions.

  Trading History: {{{tradingHistory}}}
  Risk Tolerance: {{{riskTolerance}}}
  Market Conditions: {{{marketConditions}}}

  Generate a list of trading suggestions and explain your reasoning. Focus on actionable insights and avoid generic advice.`,
});

const generateTradingSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateTradingSuggestionsFlow',
    inputSchema: TradingSuggestionsInputSchema,
    outputSchema: TradingSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
