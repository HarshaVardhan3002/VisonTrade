
'use client';

import { useState, useEffect, KeyboardEvent } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bot, LayoutDashboard, Menu, Newspaper, Orbit, X, Search, BarChart, BrainCircuit, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { useAIToggle } from '@/providers/ai-toggle-provider';

const allNavItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, ai: false },
  { name: 'AI Assistant', href: '/ai-assistant', icon: Bot, ai: true },
  { name: 'News', href: '/news', icon: Newspaper, ai: false },
  { name: 'Subscription', href: '/subscription', icon: Star, ai: false },
];


export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAIEnabled, toggleAI } = useAIToggle();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const isDashboard = pathname === '/dashboard';
  const showAiToggle = isDashboard;

  const mainNavItems = allNavItems.filter(item => !item.ai || isAIEnabled);
  const mobileNavItems = allNavItems.filter(item => !item.ai || isAIEnabled);


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
        router.push(`/dashboard?stock=${searchTerm.trim().toUpperCase()}`);
    }
  }

  const renderNavLinks = (items: typeof mainNavItems) => (
      <>
        {items.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            asChild
            className={cn(
              "relative text-muted-foreground hover:text-primary transition-colors px-3 py-2",
              pathname === item.href && "text-primary"
            )}
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4 md:hidden" />
              <span>{item.name}</span>
              {pathname === item.href && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          </Button>
        ))}
      </>
  )

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="max-w-full mx-auto px-4">
        <motion.div
          className={cn(
            "w-full h-16 rounded-lg glass-card flex items-center justify-between px-4 lg:px-6 transition-all duration-300 mt-2",
            scrolled ? "bg-card/80" : "bg-card/50"
          )}
        >
          <Link href="/" className="flex items-center gap-2">
            <Orbit className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-bold text-foreground hidden sm:block">VisionTrade</h1>
          </Link>
          
          <nav className="hidden md:flex items-center gap-2">
            {renderNavLinks(mainNavItems)}
          </nav>

          {isDashboard && (
             <div className="hidden md:flex items-center gap-4 flex-grow max-w-xl mx-4">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search Ticker..." 
                        className="pl-9 bg-background/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary"><BarChart /></Button>
                {showAiToggle && (
                    <div className="flex items-center space-x-2">
                        <Switch id="ai-toggle" checked={isAIEnabled} onCheckedChange={toggleAI} />
                        <Label htmlFor="ai-toggle" className="text-sm text-muted-foreground flex items-center gap-1.5"><BrainCircuit className="h-4 w-4" /> AI</Label>
                    </div>
                )}
              </div>
          )}
          
          <div className="flex items-center gap-2">
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <AnimatePresence initial={false} mode="wait">
                      <motion.div
                        key={isMobileMenuOpen ? 'x' : 'menu'}
                        initial={{ rotate: 45, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -45, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                      </motion.div>
                    </AnimatePresence>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="glass-card w-[250px] p-4 border-r-0">
                  <div className="flex flex-col gap-4 pt-8">
                  {mobileNavItems.map((item) => (
                    <Button
                      key={item.name}
                      variant={pathname === item.href ? "secondary" : "ghost"}
                      className="justify-start"
                      asChild
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href={item.href}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </Button>
                  ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
