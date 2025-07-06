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
import { Loader2, Sparkles, AlertCircle, CheckCircle, Info, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';
import { motion } from 'framer-motion';
import { useAIToggle } from '@/providers/ai-toggle-provider';

interface NewsFeedProps {
  stockSymbol: string;
  setContextualMessage: (message: { text: string; type: 'info' | 'success' | 'warning' } | null) => void;
}

type Headline = GetNewsOutput['headlines'][number] & {
  sentiment?: GetNewsSentimentOutput;
  loadingSentiment?: boolean;
};

const feedVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  }
};


export function NewsFeed({ stockSymbol, setContextualMessage }: NewsFeedProps) {
  const [news, setNews] = useState<Headline[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAIEnabled } = useAIToggle();

  useEffect(() => {
    async function fetchNews() {
      if (!stockSymbol) return;
      setLoading(true);
      try {
        const result = await getNews({ stockSymbol });
        setNews(result.headlines);
      } catch (err: any) {
        console.error('Failed to fetch news:', err);
        const errorMessage = err.message || 'An unexpected error occurred.';
        let description = 'Could not load news feed.';
        if (errorMessage.includes('429')) {
          description = "AI nap time 😴, the quota has been exceeded. Please try again later.";
        }
        toast({
          variant: 'destructive',
          title: 'Error',
          description,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [stockSymbol, toast]);

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
      if (sentimentResult.sentiment === 'Positive') {
        setContextualMessage({text: `Positive news for ${stockSymbol}! Consider this in your strategy.`, type: 'success'});
      } else if (sentimentResult.sentiment === 'Negative') {
        setContextualMessage({text: `Heads up! Negative sentiment news for ${stockSymbol}.`, type: 'warning'});
      }
    } catch (err: any) {
      console.error('Failed to get sentiment:', err);
      const errorMessage = err.message || 'An unexpected error occurred.';
      let description = 'Could not analyze sentiment.';
      if (errorMessage.includes('429')) {
        description = "AI nap time 😴, the quota has been exceeded. Please try again later.";
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description,
      });
      setNews((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, loadingSentiment: false } : item
        )
      );
    }
  };

  const getSentimentIcon = (sentiment?: 'Positive' | 'Negative' | 'Neutral') => {
    switch (sentiment) {
      case 'Positive': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'Negative': return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'Neutral': return <Info className="h-4 w-4 text-gray-400" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-lg">News Feed for {stockSymbol}</CardTitle>
        <CardDescription className="text-xs">Latest headlines impacting your assets.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ScrollArea className="h-full pr-4">
            <motion.div variants={feedVariants} initial="hidden" animate="visible" className="space-y-4">
              {news.map((item, index) => (
                 <motion.div key={index} variants={cardVariants} whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 10 } }}>
                    <Card
                      className="bg-card/70 hover:bg-card/90 shadow-sm hover:shadow-neon-glow-accent transition-all duration-300"
                    >
                      <CardHeader className="p-4">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                            <CardTitle className="text-sm flex items-start gap-2">
                               <span>{item.title}</span>
                               <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0 mt-1" />
                           </CardTitle>
                        </a>
                        <CardDescription className="text-xs">
                          {item.source} - {item.timestamp}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-xs text-muted-foreground">
                          {item.summary}
                        </p>
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
                      <CardFooter className="p-4 pt-0">
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
              ))}
            </motion.div>
          </ScrollArea>
        )}
      </CardContent>
    </div>
  );
}
