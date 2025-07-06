'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, Bot, Star, Zap } from 'lucide-react';
import { FloatingParticles } from '@/components/floating-particles';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100 },
  },
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <motion.div
    variants={itemVariants}
    className="glass-card p-6 rounded-lg text-center flex flex-col items-center"
  >
    <div className="text-primary bg-primary/10 p-3 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

const testimonials = [
  {
    name: 'Alex T.',
    role: 'Day Trader',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    text: "VisionTrade's AI assistant is a game-changer. It surfaces insights I would have missed, giving me a real edge in the market.",
  },
  {
    name: 'Samantha K.',
    role: 'Financial Analyst',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    text: 'The real-time news analysis and sentiment scores are incredibly accurate. It has streamlined my workflow and improved my recommendations.',
  },
  {
    name: 'David L.',
    role: 'Hobbyist Investor',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    text: 'As someone new to trading, the UI is intuitive and the AI suggestions are easy to understand. I feel much more confident in my decisions.',
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-background via-blue-950/20 to-background text-foreground overflow-x-hidden">
      <FloatingParticles />
      <div className="absolute inset-0 bg-grid-pattern -z-0"></div>
      <div className="relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            variants={itemVariants}
            className="text-center py-24 md:py-32"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-primary/80 pb-4">
              Trade Smarter with AI.
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mt-4">
              Leverage cutting-edge AI to analyze markets, get real-time
              insights, and execute trades with unparalleled precision.
            </p>
            <motion.div
              variants={itemVariants}
              className="mt-8 flex justify-center gap-4"
            >
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Launch Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/subscription">View Plans</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-32"
            variants={containerVariants}
          >
            <FeatureCard
              icon={<Zap className="h-8 w-8" />}
              title="Real-Time Analysis"
              description="Our AI processes market data faster than ever, giving you an edge in fast-moving markets."
            />
            <FeatureCard
              icon={<Bot className="h-8 w-8" />}
              title="AI Trading Assistant"
              description="Chat with our AI to get personalized trading strategies and insights on any stock."
            />
            <FeatureCard
              icon={<BarChart className="h-8 w-8" />}
              title="Auto Sentiment"
              description="Instantly gauge market sentiment with AI-powered analysis of news and social media."
            />
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="text-center pb-32"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-extrabold mb-12"
            >
              Trusted by Traders Worldwide
            </motion.h2>
            <motion.div variants={itemVariants}>
              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                className="w-full max-w-4xl mx-auto"
              >
                <CarouselContent>
                  {testimonials.map((testimonial, index) => (
                    <CarouselItem
                      key={index}
                      className="md:basis-1/2 lg:basis-1/3"
                    >
                      <div className="p-1 h-full">
                        <Card className="glass-card h-full flex flex-col justify-between">
                          <CardContent className="p-6 text-left">
                            <div className="flex text-yellow-400 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-current" />
                              ))}
                            </div>
                            <p className="text-muted-foreground mb-4">
                              {testimonial.text}
                            </p>
                            <div className="flex items-center gap-4 pt-4 border-t border-border">
                              <Avatar>
                                <AvatarImage
                                  src={testimonial.avatar}
                                  alt={testimonial.name}
                                />
                                <AvatarFallback>
                                  {testimonial.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold">
                                  {testimonial.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {testimonial.role}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
              </Carousel>
            </motion.div>
          </motion.div>

          <motion.footer
            variants={itemVariants}
            className="text-center py-8 text-muted-foreground"
          >
            <div className="flex justify-center gap-6 mb-4">
              <Link href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
            <p>&copy; {new Date().getFullYear()} VisionTrade. All rights reserved.</p>
          </motion.footer>
        </motion.div>
      </div>
    </div>
  );
}
