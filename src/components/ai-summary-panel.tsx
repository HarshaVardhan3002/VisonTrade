'use client';

import { useState, useEffect } from 'react';
import { getStockInfo } from '@/ai/flows/get-stock-info';
import type { StockInfoOutput } from '@/ai/schemas';
import { Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion, useAnimationControls } from 'framer-motion';

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
        opacity: [0.5, 1],
        y: [10, 0],
        transition: { duration: 0.5 }
      });
    }
  }, [stockInfo, loading, controls]);

  const getSuggestionIcon = () => {
    if (!stockInfo) return null;
    const iconProps = {
      className: "h-5 w-5",
    }
    const pulseAnimation = {
        scale: [1, 1.2, 1],
        transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
    };
    
    switch (stockInfo.suggestion) {
      case 'BUY':
        return <motion.div animate={pulseAnimation} className="text-green-400"><TrendingUp {...iconProps}/></motion.div>;
      case 'SELL':
        return <motion.div animate={pulseAnimation} className="text-red-400"><TrendingDown {...iconProps}/></motion.div>;
      case 'HOLD':
        return <Minus {...iconProps} className="h-5 w-5 text-gray-400"/>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!stockInfo) {
    return <p className="text-sm text-muted-foreground">No analysis available.</p>;
  }

  return (
    <motion.div initial={{opacity: 0}} animate={controls} className="space-y-4">
      <div>
        <h4 className="font-semibold text-sm text-primary">Summary</h4>
        <p className="text-sm text-muted-foreground">{stockInfo.summary}</p>
      </div>
      <div>
        <h4 className="font-semibold text-sm text-primary">Suggestion</h4>
        <div className="flex items-center gap-2">
          {getSuggestionIcon()}
          <span className="text-lg font-medium">{stockInfo.suggestion}</span>
        </div>
      </div>
       <div>
        <h4 className="font-semibold text-sm text-primary">Reasoning</h4>
        <p className="text-sm text-muted-foreground">{stockInfo.reasoning}</p>
      </div>
    </motion.div>
  );
}

export function AiSummaryPanel({ stockSymbol }: { stockSymbol: string }) {
  const [stockInfo, setStockInfo] = useState<StockInfoOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStockInfo() {
      if (!stockSymbol) return;
      setLoading(true);
      setError(null);
      try {
        const result = await getStockInfo({ stockSymbol });
        setStockInfo(result);
      } catch (err: any) {
        const errorMessage = err.message || 'An unexpected error occurred.';
        console.error('Failed to fetch stock info:', err);
        if (errorMessage.includes('429')) {
           setError("AI nap time 😴, the quota has been exceeded. Please try again later.");
        } else {
           setError(`Could not load analysis for ${stockSymbol}.`);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchStockInfo();
  }, [stockSymbol]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
        <p>{error}</p>
      </div>
    );
  }

  return <StockAnalysis stockInfo={stockInfo} loading={loading} />;
}
