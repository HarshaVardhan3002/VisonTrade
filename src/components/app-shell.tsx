'use client';

import { Header } from '@/components/header';
import { AIToggleProvider } from '@/providers/ai-toggle-provider';

export function AppShell({ children }: { children: React.ReactNode }) {
  const showHeader = true; 

  return (
    <AIToggleProvider>
        <div className="flex flex-col min-h-screen">
        {showHeader && <Header />}
        <main className="flex-grow flex flex-col">
            {children}
            </main>
        </div>
    </AIToggleProvider>
  );
}
