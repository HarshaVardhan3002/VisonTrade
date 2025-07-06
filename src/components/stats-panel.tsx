'use client';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Market Cap', value: '2.79T' },
  { label: 'P/E Ratio', value: '29.45' },
  { label: 'Dividend Yield', value: '0.53%' },
  { label: '52 Week High', value: '198.23' },
  { label: '52 Week Low', value: '124.17' },
  { label: 'Avg. Volume', value: '55.6M' },
  { label: 'Beta', value: '1.29' },
];

export function StatsPanel({ stockSymbol }: { stockSymbol: string }) {
  return (
    <div className="space-y-3">
       <h3 className="font-semibold text-lg">{stockSymbol} Key Statistics</h3>
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-white/5"
        >
          <span className="text-muted-foreground">{stat.label}</span>
          <span className="font-medium text-foreground">{stat.value}</span>
        </motion.div>
      ))}
    </div>
  );
}
