'use server';
/**
 * @fileOverview AI-powered chat functionality.
 *
 * - aiChat - A function that handles a chat conversation.
 */

import {ai} from '@/ai/genkit';
import {
  AiChatInputSchema,
  AiChatOutputSchema,
  type AiChatInput,
  type AiChatOutput,
} from '@/ai/schemas';

export async function aiChat(
  input: AiChatInput
): Promise<AiChatOutput> {
  return aiChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatPrompt',
  input: {schema: AiChatInputSchema},
  output: {schema: AiChatOutputSchema},
  prompt: `You are VisionTrade's AI assistant, an expert in financial markets and trading. You are helpful, friendly, and provide insightful, concise answers. The user is currently viewing the stock: {{{stockContext}}}.

  Continue the following conversation.

  {{#each history}}
  {{#if (eq role 'user')}}
  User: {{{content}}}
  {{else}}
  Assistant: {{{content}}}
  {{/if}}
  {{/each}}
  User: {{{query}}}
  Assistant:`,
});

const aiChatFlow = ai.defineFlow(
  {
    name: 'aiChatFlow',
    inputSchema: AiChatInputSchema,
    outputSchema: AiChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
