'use client'
import { useState, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { aiChat } from '@/ai/flows/ai-chat';
import type { ChatMessage } from '@/ai/schemas';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Sparkles, Send, Bot, User, BrainCircuit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAIToggle } from '@/providers/ai-toggle-provider';

const Typewriter = ({ text, onComplete }: { text: string, onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayedText(''); 
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
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
      transition={{ ...typingBubbleTransition, delay: 0 }}
      initial="start"
      animate="end"
    />
    <motion.span
      className="h-1.5 w-1.5 bg-muted-foreground rounded-full"
      variants={typingBubbleVariants}
      transition={{ ...typingBubbleTransition, delay: 0.1 }}
      initial="start"
      animate="end"
    />
    <motion.span
      className="h-1.5 w-1.5 bg-muted-foreground rounded-full"
      variants={typingBubbleVariants}
      transition={{ ...typingBubbleTransition, delay: 0.2 }}
      initial="start"
      animate="end"
    />
  </div>
);


export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<{ query: string }>();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isTyping, setIsTyping] = useState(false);
  const { isAIEnabled } = useAIToggle();
  
  useEffect(() => {
      setMessages([{
          role: 'model',
          content: "Hello! I'm VisionTrade's AI assistant. How can I help you with your trading today? You can ask me about specific stocks, market trends, or general financial concepts."
      }])
  }, [])

  const onSubmit: SubmitHandler<{ query: string }> = async ({ query }) => {
    if (!query.trim() || loading) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setLoading(true);
    reset();

    try {
      const chatHistory = newMessages.slice(0, -1);
      const result = await aiChat({ history: chatHistory, query, stockContext: "general" });
      
      const newAIMessage: ChatMessage = { role: 'model', content: result.response };
      setMessages([...newMessages, newAIMessage]);
      setIsTyping(true);

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "AI chat is currently unavailable.",
      });
      setMessages(messages); // Revert to previous state on error
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
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


  if (!isAIEnabled) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <BrainCircuit className="h-16 w-16 text-primary mb-4" />
            <h2 className="text-2xl font-bold">AI Assistant Disabled</h2>
            <p className="text-muted-foreground mt-2">
                Please enable the AI features using the toggle switch in the header to use the assistant.
            </p>
        </div>
    )
  }

  return (
    <div className="h-full flex flex-col p-4">
      <Card className="glass-card flex-grow flex flex-col">
        <CardContent className="p-0 flex flex-col flex-grow">
          <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
            <div className="space-y-6 max-w-4xl mx-auto w-full">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    layout
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="flex items-start gap-4"
                  >
                    <Avatar className="mt-1">
                      {msg.role === 'user' ? (
                          <AvatarFallback className="bg-secondary text-secondary-foreground"><User /></AvatarFallback>
                      ) : (
                          <AvatarFallback className="bg-primary text-primary-foreground"><Bot /></AvatarFallback>
                      )}
                    </Avatar>
                    <div
                      className={`max-w-xl rounded-lg px-4 py-3 text-sm ${
                        msg.role === 'user' ? 'bg-secondary' : 'bg-background/40'
                      }`}
                    >
                      {msg.role === 'model' && isTyping && i === messages.length - 1 ? (
                        <Typewriter text={msg.content} onComplete={() => setIsTyping(false)} />
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && (
                 <motion.div layout className="flex items-start gap-4">
                    <Avatar><AvatarFallback className="bg-primary text-primary-foreground"><Bot /></AvatarFallback></Avatar>
                   <div className="rounded-lg bg-background/40">
                      <TypingIndicator />
                   </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-border mt-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 max-w-4xl mx-auto">
              <Input {...register('query')} placeholder="Ask about a stock or market trend..." autoComplete="off" disabled={loading} className="bg-background/50"/>
              <Button type="submit" size="icon" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
