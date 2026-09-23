'use client';

/**
 * WORDS — a line that arrives a word at a time: each word lifts, sharpens out
 * of a blur and fades in, staggered. The way the big product pages set a
 * headline. Words stay words (spaces kept), so wrapping and screen readers are
 * untouched; reduced motion shows the line at rest.
 */

import { motion, useReducedMotion } from 'framer-motion';

export default function Words({ text, className = '', wordClassName = '', delay = 0, stagger = 0.07, as = 'span', children }) {
  const calm = useReducedMotion();
  const Tag = as;
  const parts = String(text).split(' ');
  if (calm) return <Tag className={className}>{text}{children}</Tag>;
  return (
    <Tag className={className} aria-label={text}>
      {parts.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          aria-hidden="true"
          className={`inline-block will-change-transform ${wordClassName}`}
          initial={{ opacity: 0, y: '0.45em', filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
        >
          {w}{i < parts.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
      {children}
    </Tag>
  );
}
