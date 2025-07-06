'use client';
import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { AiSummaryPanel } from './ai-summary-panel';
import { StatsPanel } from './stats-panel';
import { NewsFeed } from './news-feed';
import { useAIToggle } from '@/providers/ai-toggle-provider';
import { cn } from '@/lib/utils';

interface RightPanelProps {
    stockSymbol: string;
    setContextualMessage: (message: { text: string; type: 'info' | 'success' | 'warning' } | null) => void;
}

export function RightPanel({ stockSymbol, setContextualMessage }: RightPanelProps) {
  const { isAIEnabled } = useAIToggle();
  const [activeTab, setActiveTab] = useState(isAIEnabled ? 'ai' : 'news');

  return (
    <div className="glass-card rounded-lg h-full">
      <Tabs 
        defaultValue={isAIEnabled ? 'ai' : 'news'}
        value={activeTab}
        className="w-full h-full flex flex-col"
        onValueChange={setActiveTab}
      >
        <TabsList className={cn("grid w-full bg-transparent p-2", isAIEnabled ? "grid-cols-3" : "grid-cols-2")}>
          {isAIEnabled && <TabsTrigger value="ai">AI Summary</TabsTrigger>}
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>
        <div className="p-4 flex-grow overflow-y-auto">
          {isAIEnabled && (
            <TabsContent value="ai">
              {activeTab === 'ai' && <AiSummaryPanel stockSymbol={stockSymbol} />}
            </TabsContent>
          )}
           <TabsContent value="news" className="h-full">
            {activeTab === 'news' && <NewsFeed stockSymbol={stockSymbol} setContextualMessage={setContextualMessage} />}
          </TabsContent>
          <TabsContent value="stats">
            {activeTab === 'stats' && <StatsPanel stockSymbol={stockSymbol} />}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
