'use server';
/**
 * @fileOverview Scrapes real news headlines for a given stock symbol from MarketWatch.
 *
 * - getNews - A function that gets the latest news for a stock.
 */
import {ai} from '@/ai/genkit';
import {
  GetNewsInputSchema,
  GetNewsOutputSchema,
  type GetNewsInput,
  type GetNewsOutput,
} from '@/ai/schemas';
import * as cheerio from 'cheerio';


// This scraper is for demonstration purposes. Real-world scraping requires
// robust error handling, rotating user agents, and potentially proxies
// to avoid being blocked. Selectors are brittle and will break if the
// source website changes its layout.
async function scrapeMarketWatch(
  stockSymbol: string
): Promise<GetNewsOutput['headlines']> {
  const url = `https://www.marketwatch.com/investing/stock/${stockSymbol.toLowerCase()}/news`;
  try {
    const response = await fetch(url, {
      headers: {
        // Using a generic user agent can sometimes help bypass simple bot detection.
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch news for ${stockSymbol}: ${response.statusText}`
      );
      return [];
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const headlines: GetNewsOutput['headlines'] = [];

    $('.collection__elements .element--article').each((i, el) => {
      if (i >= 10) return; // Limit to 10 articles

      const titleElement = $(el).find('h3.article__headline a.link');
      const title = titleElement.text().trim();
      const articleUrl = titleElement.attr('href');

      const summary = $(el).find('p.article__summary').text().trim();
      const source =
        $(el).find('.article__provider').text().trim() || 'MarketWatch';
      const timestamp = $(el).find('.article__timestamp').text().trim();

      if (title && articleUrl) {
        headlines.push({
          title,
          url: articleUrl,
          summary,
          source,
          timestamp,
        });
      }
    });

    if (headlines.length === 0) {
      console.warn(
        `No headlines found for ${stockSymbol}. The website layout may have changed.`
      );
    }

    return headlines;
  } catch (error) {
    console.error(`Error scraping news for ${stockSymbol}:`, error);
    return [];
  }
}

export async function getNews(input: GetNewsInput): Promise<GetNewsOutput> {
  return getNewsFlow(input);
}

// Keep the AI generator as a fallback for general news categories.
const newsGeneratorPrompt = ai.definePrompt({
  name: 'newsGeneratorPrompt',
  input: {schema: GetNewsInputSchema},
  output: {schema: GetNewsOutputSchema},
  prompt: `You are a financial news generator. Create 15 plausible but fictional news headlines for the topic: {{{stockSymbol}}}.

  For each headline, provide:
  - A compelling title.
  - A reputable-sounding financial news source (e.g., "Reuters", "Bloomberg").
  - A very short, one-sentence summary of the article.
  - A realistic, relative timestamp (e.g., "45m ago", "3h ago", "1d ago").
  - A plausible but fictional URL, for example: https://www.marketwatch.com/story/example-story-slug-12345

  Ensure the headlines cover a mix of topics like earnings, product launches, market sentiment, or analyst ratings.`,
});

const getNewsFlow = ai.defineFlow(
  {
    name: 'getNewsFlow',
    inputSchema: GetNewsInputSchema,
    outputSchema: GetNewsOutputSchema,
  },
  async ({stockSymbol}) => {
    // For general news, we can't scrape a specific stock page.
    // We will revert to AI generation for these categories as a fallback.
    const nonScrapable = ['market', 'tech', 'finance', 'crypto', 'economy'];
    if (nonScrapable.includes(stockSymbol.toLowerCase())) {
      console.log(`Generating AI news for general category: ${stockSymbol}`);
      const result = await newsGeneratorPrompt({stockSymbol});
      return result.output!;
    }

    const headlines = await scrapeMarketWatch(stockSymbol);
    return {headlines};
  }
);
