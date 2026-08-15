import { motion, useReducedMotion } from 'motion/react';

/**
 * Scroll-reveal wrapper. Motivation: it sequences a section's content in
 * reading order so the eye lands on the headline before the detail.
 * Collapses to a static render under prefers-reduced-motion.
 */
export default function Reveal({
  children,
  as = 'div',
  delay = 0,
  y = 22,
  amount = 0.25,
  className,
  ...rest
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as] || motion.div;

  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
