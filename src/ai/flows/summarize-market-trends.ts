// Summarizes recent market trends and news for users to make informed trading decisions.

'use server';

import {ai} from '@/ai/genkit';
import {
  SummarizeMarketTrendsInputSchema,
  SummarizeMarketTrendsOutputSchema,
  type SummarizeMarketTrendsInput,
  type SummarizeMarketTrendsOutput,
} from '@/ai/schemas';

export async function summarizeMarketTrends(input: SummarizeMarketTrendsInput): Promise<SummarizeMarketTrendsOutput> {
  return summarizeMarketTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMarketTrendsPrompt',
  input: {schema: SummarizeMarketTrendsInputSchema},
  output: {schema: SummarizeMarketTrendsOutputSchema},
  prompt: `You are an AI assistant providing concise summaries of market trends for traders.

  Given the following news summary, provide a brief overview of the current market situation and potential impacts on trading decisions:

  News Summary:
  {{newsSummary}}
  `,
});

const summarizeMarketTrendsFlow = ai.defineFlow(
  {
    name: 'summarizeMarketTrendsFlow',
    inputSchema: SummarizeMarketTrendsInputSchema,
    outputSchema: SummarizeMarketTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
