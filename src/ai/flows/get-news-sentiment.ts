'use server';
/**
 * @fileOverview AI-powered news sentiment analysis.
 *
 * - getNewsSentiment - Analyzes the sentiment of a news article.
 */
import {ai} from '@/ai/genkit';
import {
  GetNewsSentimentInputSchema,
  GetNewsSentimentOutputSchema,
  type GetNewsSentimentInput,
  type GetNewsSentimentOutput,
} from '@/ai/schemas';

export async function getNewsSentiment(
  input: GetNewsSentimentInput
): Promise<GetNewsSentimentOutput> {
  return getNewsSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'newsSentimentPrompt',
  input: {schema: GetNewsSentimentInputSchema},
  output: {schema: GetNewsSentimentOutputSchema},
  prompt: `You are a financial sentiment analyst. Analyze the following news headline and summary to determine if its sentiment is Positive, Negative, or Neutral for the associated company.

  Headline: {{{title}}}
  Summary: {{{summary}}}

  Provide your sentiment analysis and a concise, one-sentence reasoning.`,
});


const getNewsSentimentFlow = ai.defineFlow(
  {
    name: 'getNewsSentimentFlow',
    inputSchema: GetNewsSentimentInputSchema,
    outputSchema: GetNewsSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
