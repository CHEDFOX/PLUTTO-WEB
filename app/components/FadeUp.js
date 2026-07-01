'use client';

import { motion } from 'framer-motion';

export default function FadeUp({
  children,
  delay = 0,
  y = 24,
  duration = 0.7,
  className = '',
  as = 'div',
}) {
  const MotionTag = motion[as] ?? motion.div;
  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
