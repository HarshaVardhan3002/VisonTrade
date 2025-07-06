'use client';
import { useState, useEffect } from 'react';
import { getNews } from '@/ai/flows/get-news';
import { getNewsSentiment } from '@/ai/flows/get-news-sentiment';
import type { GetNewsOutput, GetNewsSentimentOutput } from '@/ai/schemas';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, AlertCircle, CheckCircle, Info, Newspaper, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useAIToggle } from '@/providers/ai-toggle-provider';

type Headline = GetNewsOutput['headlines'][number] & {
  sentiment?: GetNewsSentimentOutput;
  loadingSentiment?: boolean;
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      type: 'spring',
      stiffness: 100,
    },
  }),
};

const filterCategories = ['All', 'AAPL', 'GOOGL', 'TSLA', 'Crypto', 'Economy'];

const NewsCard = ({
  item,
  index,
  handleAskAi,
}: {
  item: Headline;
  index: number;
  handleAskAi: (index: number) => void;
}) => {
  const { isAIEnabled } = useAIToggle();
  const getSentimentIcon = (sentiment?: 'Positive' | 'Negative' | 'Neutral') => {
    switch (sentiment) {
      case 'Positive':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'Negative':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'Neutral':
        return <Info className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
    >
      <Card className="glass-card hover:border-primary/50 shadow-sm hover:shadow-neon-glow-accent transition-all duration-300 h-full flex flex-col">
        <CardHeader>
           <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            <CardTitle className="text-base flex items-start gap-2">
                <span>{item.title}</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
            </CardTitle>
          </a>
          <CardDescription>
            {item.source} - {item.timestamp}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground">{item.summary}</p>
          {isAIEnabled && item.sentiment && (
            <div className="mt-3 p-2 bg-background/50 rounded-md text-xs space-y-1">
              <div className="flex items-center gap-2 font-semibold">
                {getSentimentIcon(item.sentiment.sentiment)}
                <span>AI Sentiment: {item.sentiment.sentiment}</span>
              </div>
              <p className="text-muted-foreground">{item.sentiment.reasoning}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
            {isAIEnabled && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAskAi(index)}
                    disabled={item.loadingSentiment}
                >
                    {item.loadingSentiment ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Ask AI for Sentiment
                </Button>
            )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default function NewsPage() {
  const [news, setNews] = useState<Headline[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState('All');
  const { isAIEnabled } = useAIToggle();

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const stockSymbol = activeFilter === 'All' ? 'market' : activeFilter;
        const result = await getNews({ stockSymbol });
        setNews(result.headlines);
      } catch (error) {
        console.error('Failed to fetch news:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load news feed.',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [activeFilter, toast]);

  const handleAskAi = async (index: number) => {
    const headline = news[index];
    if (!headline || headline.loadingSentiment || !isAIEnabled) return;

    setNews((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, loadingSentiment: true } : item
      )
    );

    try {
      const sentimentResult = await getNewsSentiment({
        title: headline.title,
        summary: headline.summary,
      });
      setNews((prev) =>
        prev.map((item, i) =>
          i === index
            ? { ...item, sentiment: sentimentResult, loadingSentiment: false }
            : item
        )
      );
    } catch (error) {
      console.error('Failed to get sentiment:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not analyze sentiment.',
      });
      setNews((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, loadingSentiment: false } : item
        )
      );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-3xl">
            <Newspaper className="text-primary" />
            News Dashboard
          </CardTitle>
          <CardDescription>
            A detailed news dashboard with filters and search functionality.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {filterCategories.map((category) => (
                <Button
                  key={category}
                  variant={activeFilter === category ? 'secondary' : 'ghost'}
                  onClick={() => setActiveFilter(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item, index) => (
                <NewsCard key={index} item={item} index={index} handleAskAi={handleAskAi} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
