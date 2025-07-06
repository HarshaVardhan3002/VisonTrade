'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { getStockInfo } from '@/ai/flows/get-stock-info';
import { aiChat } from '@/ai/flows/ai-chat';
import type { StockInfoOutput, ChatMessage } from '@/ai/schemas';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Sparkles, Send, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';

interface AIAssistantProps {
  stockSymbol: string;
}

const Typewriter = ({ text, onComplete }: { text: string, onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayedText(''); // Reset on new text
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        if(onComplete) onComplete();
      }
    }, 20);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return <>{displayedText}</>;
};

const typingBubbleVariants = {
  start: { y: "0%" },
  end: { y: "-100%" },
};
const typingBubbleTransition = {
  duration: 0.4,
  repeat: Infinity,
  repeatType: 'reverse' as const,
  ease: "easeInOut",
};

const TypingIndicator = () => (
  <div className="flex items-center justify-center gap-1.5 px-3 py-3">
    <motion.span
      className="h-1.5 w-1.5 bg-muted-foreground rounded-full"
      variants={typingBubbleVariants}
      transition={{...typingBubbleTransition, delay: 0}}
      initial="start"
      animate="end"
    />
    <motion.span
      className="h-1.5 w-1.5 bg-muted-foreground rounded-full"
      variants={typingBubbleVariants}
      transition={{...typingBubbleTransition, delay: 0.1}}
      initial="start"
      animate="end"
    />
    <motion.span
      className="h-1.5 w-1.5 bg-muted-foreground rounded-full"
      variants={typingBubbleVariants}
      transition={{...typingBubbleTransition, delay: 0.2}}
      initial="start"
      animate="end"
    />
  </div>
);

function StockAnalysis({
  stockInfo,
  loading,
}: {
  stockInfo: StockInfoOutput | null;
  loading: boolean;
}) {
  const controls = useAnimationControls();

  useEffect(() => {
    if (!loading && stockInfo) {
      controls.start({
        borderColor: ["hsl(var(--primary))", "hsl(var(--primary) / 0.5)", "hsl(var(--border))"],
        boxShadow: ["0 0 20px hsl(var(--primary) / 0.5)", "0 0 10px hsl(var(--primary) / 0.3)", "0 0 0px hsl(var(--primary) / 0)"],
        transition: { 
          duration: 0.8,
          ease: 'circOut',
          times: [0, 0.5, 1]
        }
      });
    }
  }, [stockInfo, loading, controls]);

  const getSuggestionIcon = () => {
    if (!stockInfo) return null;
    switch (stockInfo.suggestion) {
      case 'BUY':
        return <TrendingUp className="h-5 w-5 text-green-400" />;
      case 'SELL':
        return <TrendingDown className="h-5 w-5 text-red-400" />;
      case 'HOLD':
        return <Minus className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <motion.div animate={controls} className="p-4 bg-background/30 rounded-lg space-y-4 border border-border">
      <h3 className="text-lg font-semibold text-primary">AI Analysis</h3>
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : stockInfo ? (
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm">Summary</h4>
            <p className="text-xs text-muted-foreground">{stockInfo.summary}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm">Suggestion</h4>
            <div className="flex items-center gap-2">
              {getSuggestionIcon()}
              <span className="text-sm font-medium">{stockInfo.suggestion}</span>
            </div>
          </div>
           <div>
            <h4 className="font-semibold text-sm">Reasoning</h4>
            <p className="text-xs text-muted-foreground">{stockInfo.reasoning}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No analysis available.</p>
      )}
    </motion.div>
  );
}

function ChatInterface({ stockSymbol }: { stockSymbol: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<{ query: string }>();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isTyping, setIsTyping] = useState(false);

  const onSubmit: SubmitHandler<{ query: string }> = async ({ query }) => {
    if (!query.trim() || loading) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setLoading(true);
    reset();

    try {
      const chatHistory = newMessages.slice(0, -1);
      const result = await aiChat({ history: chatHistory, query, stockContext: stockSymbol });
      
      const newAIMessage: ChatMessage = { role: 'model', content: result.response };
      setMessages([...newMessages, newAIMessage]);
      setIsTyping(true);

    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || 'An unexpected error occurred.';
      let description = "AI chat is currently unavailable.";
       if (errorMessage.includes('429')) {
          description = "AI nap time 😴, the quota has been exceeded. Please try again later.";
        }
      toast({
        variant: "destructive",
        title: "Error",
        description,
      });
      setMessages(messages); // Revert to previous state on error
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Debounce scrolling to prevent weird jumps during animation
    const timer = setTimeout(() => {
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);


  return (
    <div className="flex flex-col h-full flex-grow">
      <h3 className="text-lg font-semibold text-primary p-4 pb-2">Chat with AI</h3>
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-sm lg:max-w-xs rounded-lg px-3 py-2 text-sm ${
                    msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  }`}
                >
                  {msg.role === 'model' && isTyping && i === messages.length - 1 ? (
                    <Typewriter text={msg.content} onComplete={() => setIsTyping(false)} />
                  ) : (
                    msg.content
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
             <motion.div layout className="flex justify-start">
               <div className="rounded-lg bg-secondary">
                  <TypingIndicator />
               </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 border-t border-border flex items-center gap-2">
        <Input {...register('query')} placeholder={`Ask about ${stockSymbol}...`} autoComplete="off" disabled={loading} className="bg-background/50"/>
        <Button type="submit" size="icon" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}


export function AIAssistant({ stockSymbol }: AIAssistantProps) {
  const [stockInfo, setStockInfo] = useState<StockInfoOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let isCancelled = false;
    async function fetchStockInfo() {
      if (!stockSymbol) return;
      setLoading(true);
      try {
        const result = await getStockInfo({ stockSymbol });
        if (!isCancelled) {
          setStockInfo(result);
        }
      } catch (err: any) {
        console.error('Failed to fetch stock info:', err);
        const errorMessage = err.message || 'An unexpected error occurred.';
        let description = `Could not load analysis for ${stockSymbol}.`;
         if (errorMessage.includes('429')) {
          description = "AI nap time 😴, the quota has been exceeded. Please try again later.";
        }
        if (!isCancelled) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description,
          });
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    fetchStockInfo();
    
    return () => {
      isCancelled = true;
    }
  }, [stockSymbol, toast]);

  return (
    <Card className="glass-card h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary" />
          AI Trading Assistant
        </CardTitle>
        <CardDescription>AI-powered insights for {stockSymbol}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col min-h-0 p-0">
        <StockAnalysis stockInfo={stockInfo} loading={loading} />
        <div className="flex-grow flex flex-col min-h-0 mt-2 border-t border-border">
          <ChatInterface stockSymbol={stockSymbol} />
        </div>
      </CardContent>
    </Card>
  );
}
