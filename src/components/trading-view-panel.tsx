'use client';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface TradingViewPanelProps {
  stockSymbol: string;
}

export function TradingViewPanel({ stockSymbol }: TradingViewPanelProps) {
  // In a real app, this would be a more sophisticated TradingView widget.
  // We're using a simple iframe placeholder.
  const tradingViewUrl = `https://www.tradingview.com/widgetembed/?symbol=${stockSymbol}&interval=1D&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC&withdateranges=1&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=localhost&utm_medium=widget_new&utm_campaign=chart&utm_term=${stockSymbol}`;

  return (
    <Card className="glass-card shadow-neon-glow flex flex-col h-[calc(100vh-6.5rem)] min-h-[400px]">
      <CardContent className="flex-grow p-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={stockSymbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { type: 'spring', stiffness: 300, damping: 30, mass: 1 },
            }}
            exit={{ opacity: 0, x: 20, transition: {duration: 0.2, ease: 'easeOut'} }}
            className="w-full h-full"
          >
            <div className="w-full h-full rounded-md overflow-hidden">
              <iframe
                src={tradingViewUrl}
                title="TradingView Chart"
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
