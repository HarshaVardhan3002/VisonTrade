'use client';

import { createContext, useState, useContext, ReactNode } from 'react';

interface AIToggleContextType {
  isAIEnabled: boolean;
  toggleAI: () => void;
}

const AIToggleContext = createContext<AIToggleContextType | undefined>(undefined);

export function AIToggleProvider({ children }: { children: ReactNode }) {
  const [isAIEnabled, setIsAIEnabled] = useState(true);

  const toggleAI = () => {
    setIsAIEnabled(prevState => !prevState);
  };

  return (
    <AIToggleContext.Provider value={{ isAIEnabled, toggleAI }}>
      {children}
    </AIToggleContext.Provider>
  );
}

export function useAIToggle() {
  const context = useContext(AIToggleContext);
  if (context === undefined) {
    throw new Error('useAIToggle must be used within an AIToggleProvider');
  }
  return context;
}
