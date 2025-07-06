/**
 * @fileOverview Schemas and types for AI flows.
 */
import {z} from 'zod';

// From ai-chat.ts
export const ChatMessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const AiChatInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe("The conversation history."),
  query: z.string().describe('The latest user query.'),
  stockContext: z
    .string()
    .describe('The stock symbol the user is currently viewing.'),
});
export type AiChatInput = z.infer<typeof AiChatInputSchema>;

export const AiChatOutputSchema = z.object({
  response: z.string().describe('The AI assistant\'s response.'),
});
export type AiChatOutput = z.infer<typeof AiChatOutputSchema>;

// From generate-trading-suggestions.ts
export const TradingSuggestionsInputSchema = z.object({
  tradingHistory: z
    .string()
    .describe('A summary of the users past trading history.'),
  riskTolerance: z
    .string()
    .describe('The users self-described risk tolerance.'),
  marketConditions: z
    .string()
    .describe('A summary of the current market conditions.'),
});
export type TradingSuggestionsInput = z.infer<typeof TradingSuggestionsInputSchema>;

export const TradingSuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('A list of personalized trading suggestions.'),
  reasoning: z
    .string()
    .describe('The AI reasoning behind the generated suggestions.'),
});
export type TradingSuggestionsOutput = z.infer<typeof TradingSuggestionsOutputSchema>;

// From get-news-sentiment.ts
export const GetNewsSentimentInputSchema = z.object({
  title: z.string().describe('The title of the news article.'),
  summary: z.string().describe('The summary of the news article.'),
});
export type GetNewsSentimentInput = z.infer<typeof GetNewsSentimentInputSchema>;

export const GetNewsSentimentOutputSchema = z.object({
  sentiment: z
    .enum(['Positive', 'Negative', 'Neutral'])
    .describe('The overall sentiment of the article.'),
  reasoning: z
    .string()
    .describe('A brief explanation for the sentiment analysis.'),
});
export type GetNewsSentimentOutput = z.infer<
  typeof GetNewsSentimentOutputSchema
>;

// From get-news.ts
export const GetNewsInputSchema = z.object({
  stockSymbol: z.string().describe('The stock ticker symbol, e.g., AAPL.'),
});
export type GetNewsInput = z.infer<typeof GetNewsInputSchema>;

export const NewsHeadlineSchema = z.object({
    title: z.string().describe('The news headline.'),
    url: z.string().url().describe('The URL to the full news article.'),
    source: z.string().describe('The source of the news (e.g., Reuters, Bloomberg).'),
    summary: z.string().describe('A one-sentence summary of the news article.'),
    timestamp: z.string().describe('A relative timestamp, e.g., "2h ago".'),
});

export const GetNewsOutputSchema = z.object({
  headlines: z
    .array(NewsHeadlineSchema)
    .describe('An array of recent news headlines.'),
});
export type GetNewsOutput = z.infer<typeof GetNewsOutputSchema>;


// From get-stock-info.ts
export const StockInfoInputSchema = z.object({
  stockSymbol: z.string().describe('The stock ticker symbol, e.g., GOOGL.'),
});
export type StockInfoInput = z.infer<typeof StockInfoInputSchema>;

export const StockInfoOutputSchema = z.object({
  summary: z.string().describe("A brief summary of the stock's current situation."),
  suggestion: z
    .enum(['BUY', 'HOLD', 'SELL'])
    .describe('A trading suggestion for the stock.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the trading suggestion.'),
});
export type StockInfoOutput = z.infer<typeof StockInfoOutputSchema>;


// From summarize-market-trends.ts
export const SummarizeMarketTrendsInputSchema = z.object({
  newsSummary: z.string().describe('A summary of recent market news.'),
});
export type SummarizeMarketTrendsInput = z.infer<typeof SummarizeMarketTrendsInputSchema>;

export const SummarizeMarketTrendsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of recent market trends and their potential impact on trading decisions.'),
});
export type SummarizeMarketTrendsOutput = z.infer<typeof SummarizeMarketTrendsOutputSchema>;
