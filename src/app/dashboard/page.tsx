'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { TradingViewPanel } from '@/components/trading-view-panel';
import { TradingToolbar } from '@/components/trading-toolbar';
import { RightPanel } from '@/components/right-panel';
import { FloatingParticles } from '@/components/floating-particles';
import { Loader2 } from 'lucide-react';
import { MobileAssistantDrawer } from '@/components/mobile-assistant-drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const marketData = {
  us: { name: 'US Stocks', stocks: ['AAPL', 'GOOGL', 'TSLA', 'AMZN', 'MSFT', 'NVDA'] },
  in: { name: 'Indian Market', stocks: ['NSE:RELIANCE', 'NSE:TCS', 'NSE:HDFCBANK', 'NSE:INFY', 'NSE:ICICIBANK', 'NSE:SBIN'] },
  fx: { name: 'Forex', stocks: ['FX:EURUSD', 'FX:GBPUSD', 'FX:USDJPY', 'FX:AUDUSD', 'FX:USDCAD', 'FX:NZDUSD'] },
};

function StockSelectorPanel({ stocks, onSelect, selectedStock }: { stocks: string[], onSelect: (stock: string) => void, selectedStock: string }) {
  return (
    <div className="flex flex-wrap gap-2 pt-4">
      {stocks.map(stock => (
        <Button 
          key={stock} 
          variant={selectedStock === stock ? 'secondary' : 'ghost'} 
          size="sm"
          className="transition-all duration-200"
          onClick={() => onSelect(stock)}
        >
          {stock.replace(/^(NSE:|FX:)/, '')}
        </Button>
      ))}
    </div>
  )
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const stockFromUrl = searchParams.get('stock');
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [contextualMessage, setContextualMessage] = useState<{ text: string; type: 'info' | 'success' | 'warning'; } | null>(null);

  useEffect(() => {
    if (stockFromUrl) {
      setSelectedStock(stockFromUrl);
    }
  }, [stockFromUrl]);

  return (
    <div className="relative min-h-full w-full bg-gradient-to-br from-background via-blue-950/20 to-background">
      <FloatingParticles />
      <div className="absolute inset-0 bg-grid-pattern -z-0"></div>
      <div className="relative z-10 p-4 md:p-6 lg:p-4 max-w-full mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-foreground">Trading Dashboard</h1>
          <p className="text-muted-foreground">Your command center for market analysis and AI-powered insights.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-4"
        >
          <Tabs defaultValue="us" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-card/30 backdrop-blur-xl">
              <TabsTrigger value="us">{marketData.us.name}</TabsTrigger>
              <TabsTrigger value="in">{marketData.in.name}</TabsTrigger>
              <TabsTrigger value="fx">{marketData.fx.name}</TabsTrigger>
            </TabsList>
            <TabsContent value="us" className="mt-0">
              <StockSelectorPanel stocks={marketData.us.stocks} onSelect={setSelectedStock} selectedStock={selectedStock} />
            </TabsContent>
            <TabsContent value="in" className="mt-0">
              <StockSelectorPanel stocks={marketData.in.stocks} onSelect={setSelectedStock} selectedStock={selectedStock} />
            </TabsContent>
            <TabsContent value="fx" className="mt-0">
              <StockSelectorPanel stocks={marketData.fx.stocks} onSelect={setSelectedStock} selectedStock={selectedStock} />
            </TabsContent>
          </Tabs>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden md:block col-span-1"
          >
            <div className="sticky top-20">
              <TradingToolbar />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-12 md:col-span-8 lg:col-span-7"
          >
            <TradingViewPanel stockSymbol={selectedStock} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:block col-span-12 md:col-span-3 lg:col-span-4"
          >
            <div className="sticky top-20 h-[calc(100vh-6.5rem)]">
              <RightPanel stockSymbol={selectedStock} setContextualMessage={setContextualMessage} />
            </div>
          </motion.div>
        </div>
      </div>
      <MobileAssistantDrawer stockSymbol={selectedStock} contextualMessage={contextualMessage} />
    </div>
  );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <DashboardContent />
        </Suspense>
    )
}
