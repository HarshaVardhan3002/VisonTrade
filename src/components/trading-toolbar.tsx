'use client';
import {
  TrendingUp,
  Brush,
  Sigma,
  MoveRight,
  ZoomIn,
  Ruler,
  Lock,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const toolbarItems = [
  { icon: TrendingUp, label: 'Trend Line' },
  { icon: Brush, label: 'Brush' },
  { icon: Sigma, label: 'Fib Retracement' },
  { icon: MoveRight, label: 'Arrow' },
  { isSeparator: true },
  { icon: ZoomIn, label: 'Zoom In' },
  { icon: Ruler, label: 'Measure' },
  { icon: Lock, label: 'Lock' },
];

export function TradingToolbar() {
  return (
    <TooltipProvider>
      <div className="glass-card flex flex-col items-center gap-2 p-2 rounded-lg h-fit">
        {toolbarItems.map((item, index) =>
          item.isSeparator ? (
            <Separator key={index} className="my-1 bg-border/50" />
          ) : (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                >
                  <item.icon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="glass-card">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          )
        )}
      </div>
    </TooltipProvider>
  );
}
