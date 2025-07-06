'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const tiers = [
  {
    name: 'Starter',
    price: '$0',
    priceMonthly: '',
    description: 'For individuals starting out.',
    features: ['Basic Charting', '10 AI Queries/day', 'Community Support', 'Basic News Feed'],
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    price: '$49',
    priceMonthly: '/month',
    description: 'For active traders and professionals.',
    features: ['Advanced Charting', 'Unlimited AI Queries', 'Priority Support', 'Full News Feed & Analysis', 'API Access'],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Contact Us',
    priceMonthly: '',
    description: 'For teams and institutions.',
    features: ['All Pro Features', 'Dedicated Support', 'Custom Integrations', 'Team Management'],
    cta: 'Contact Sales',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      type: 'spring',
      stiffness: 100
    },
  }),
};

export default function SubscriptionPage() {
  const [loadingCta, setLoadingCta] = useState<string | null>(null);

  const handleCtaClick = (cta: string) => {
    setLoadingCta(cta);
    setTimeout(() => {
      setLoadingCta(null);
    }, 2000);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-extrabold text-primary tracking-tight">Find Your Edge</h1>
        <p className="text-muted-foreground mt-2 text-lg">Choose the plan that's right for your trading strategy.</p>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="h-full"
          >
            <Card className={cn('glass-card flex flex-col h-full transition-all duration-300 hover:border-primary/50', tier.popular ? 'border-primary shadow-neon-glow' : '')}>
              {tier.popular && (
                  <div className="absolute top-0 right-4 -mt-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase">Most Popular</div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <div className="text-4xl font-bold pt-4 text-foreground">{tier.price}<span className="text-lg font-normal text-muted-foreground">{tier.priceMonthly}</span></div>
                <CardDescription className="pt-2">{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full relative overflow-hidden" 
                  variant={tier.popular ? 'default' : 'outline'}
                  onClick={() => handleCtaClick(tier.name)}
                  disabled={!!loadingCta}
                >
                  {loadingCta === tier.name ? (
                    <>
                     <div className="absolute inset-0 bg-primary/20 animate-pulse"></div>
                     <Loader2 className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    tier.cta
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
