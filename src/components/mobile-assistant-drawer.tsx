'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Bot, X, CheckCircle, AlertCircle, Info, BrainCircuit } from 'lucide-react';
import { AIAssistant } from '@/components/ai-assistant';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIToggle } from '@/providers/ai-toggle-provider';

interface MobileAssistantDrawerProps {
  stockSymbol: string;
  contextualMessage: {
    text: string;
    type: 'info' | 'success' | 'warning';
  } | null;
}

export function MobileAssistantDrawer({
  stockSymbol,
  contextualMessage,
}: MobileAssistantDrawerProps) {
  const [open, setOpen] = useState(false);
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const { isAIEnabled } = useAIToggle();

  useEffect(() => {
    if (contextualMessage && isAIEnabled) {
      setIsBubbleVisible(true);
      const timer = setTimeout(() => {
        setIsBubbleVisible(false);
      }, 8000); // Hide after 8 seconds
      return () => clearTimeout(timer);
    } else {
      setIsBubbleVisible(false);
    }
  }, [contextualMessage, isAIEnabled]);

  const getIconAndColor = () => {
    switch (contextualMessage?.type) {
      case 'success':
        return { Icon: CheckCircle, color: 'text-green-400' };
      case 'warning':
        return { Icon: AlertCircle, color: 'text-red-400' };
      default:
        return { Icon: Info, color: 'text-primary' };
    }
  };

  const { Icon, color } = getIconAndColor();

  if (!isAIEnabled) {
      return null;
  }

  return (
    <div className="lg:hidden fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isBubbleVisible && contextualMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute bottom-full right-0 mb-4 w-72"
          >
            <div className="glass-card p-4 rounded-lg relative">
              <button
                onClick={() => setIsBubbleVisible(false)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                aria-label="Close prompt"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-start gap-3">
                <Icon className={`h-6 w-6 ${color} mt-1 shrink-0`} />
                <p className="text-sm text-foreground">
                  {contextualMessage.text}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            className="relative rounded-full h-16 w-16 bg-primary/80 backdrop-blur-md hover:bg-primary transition-all duration-300 flex items-center justify-center shadow-lg shadow-primary/20"
            aria-label="Open AI Assistant"
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: isBubbleVisible
                ? `0 0 25px var(--glow-color)`
                : `0 0 10px var(--glow-color-faded)`,
            }}
            style={
              {
                '--glow-color':
                  contextualMessage?.type === 'success'
                    ? 'hsl(var(--chart-1))'
                    : contextualMessage?.type === 'warning'
                    ? 'rgb(239 68 68)'
                    : 'hsl(var(--primary))',
                '--glow-color-faded':
                  contextualMessage?.type === 'success'
                    ? 'hsl(var(--chart-1) / 0.5)'
                    : contextualMessage?.type === 'warning'
                    ? 'rgb(239 68 68 / 0.5)'
                    : 'hsl(var(--primary) / 0.5)',
              } as React.CSSProperties
            }
          >
            <BrainCircuit className="h-8 w-8 text-background" />
          </motion.button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="glass-card w-full h-[75vh] p-0 border-t border-border/20 rounded-t-2xl"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetTitle className="sr-only">AI Assistant</SheetTitle>
          <SheetDescription className="sr-only">
            AI-powered assistant for trading insights and chat for {stockSymbol}.
          </SheetDescription>
          {open && <AIAssistant stockSymbol={stockSymbol} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}
