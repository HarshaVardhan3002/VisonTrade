'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const particleVariants = [
  <circle key="c" cx="10" cy="10" r="10" />,
  <rect key="r" width="20" height="20" rx="4" />,
  <polygon key="p" points="10,0 20,20 0,20" />,
];

const Particle = ({ initialX, initialY, size, duration, delay, children }: {
  initialX: number;
  initialY: number;
  size: number;
  duration: number;
  delay: number;
  children: React.ReactNode;
}) => (
  <motion.div
    className="absolute text-primary/10"
    style={{
      left: `${initialX}%`,
      top: `${initialY}%`,
      width: size,
      height: size,
    }}
    initial={{ y: 0, opacity: 0 }}
    animate={{
      y: [0, -60, 0],
      opacity: [0, 1, 0],
      rotate: [0, Math.random() > 0.5 ? 90: -90, 0]
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-full h-full">
      {children}
    </svg>
  </motion.div>
);

export function FloatingParticles() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      size: Math.random() * 15 + 5,
      duration: Math.random() * 10 + 10, // 10s to 20s
      delay: Math.random() * 5,
      variant: particleVariants[Math.floor(Math.random() * particleVariants.length)],
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
      {particles.map((p) => (
        <Particle
          key={p.id}
          initialX={p.initialX}
          initialY={p.initialY}
          size={p.size}
          duration={p.duration}
          delay={p.delay}
        >
          {p.variant}
        </Particle>
      ))}
    </div>
  );
}
