import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from 'motion/react';
import '../styles/cursor.css';

/*
 * A ring that trails the pointer and reacts to what is under it.
 *
 * Purpose: feedback. Hover states on this page are deliberately quiet, so the
 * ring is what confirms the pointer is on a target.
 *
 * The native cursor is never hidden. Replacing the system cursor is the
 * accessibility problem with custom cursors; adding a layer beside it is not.
 *
 * Position and size are motion values composed into one transform string, so
 * pointer movement never re-renders React and never touches layout. Only the
 * variant is state, and that changes on enter and leave.
 */

const BASE = 26;

const VARIANTS = {
  idle: { scale: 1, opacity: 0.45 },
  text: { scale: 2.5, opacity: 0.2 },
  link: { scale: 1.8, opacity: 0.9 },
  media: { scale: 3.6, opacity: 0.95 },
};

export default function Cursor() {
  const reduce = useReducedMotion();
  const [variant, setVariant] = useState('idle');
  const [label, setLabel] = useState('');
  const enabled = useRef(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const scale = useMotionValue(1);
  const opacity = useMotionValue(0);

  // Tight spring on position, softer on size: the ring should feel attached to
  // the pointer but settle into its new size rather than snap.
  const sx = useSpring(x, { stiffness: 620, damping: 42, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 620, damping: 42, mass: 0.5 });
  const sScale = useSpring(scale, { stiffness: 340, damping: 28, mass: 0.6 });
  const sOpacity = useSpring(opacity, { stiffness: 260, damping: 32 });

  const transform = useMotionTemplate`translate3d(${sx}px, ${sy}px, 0) translate(-50%, -50%) scale(${sScale})`;

  // The label lives inside the scaled ring, so it gets scaled back out.
  const inverse = useTransform(sScale, (value) => 1 / value);
  const labelTransform = useMotionTemplate`scale(${inverse})`;

  useEffect(() => {
    // Fine pointers only. Touch fires synthetic hovers on tap.
    if (reduce || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return undefined;
    }
    enabled.current = true;

    const onMove = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
      if (opacity.get() === 0) opacity.set(VARIANTS.idle.opacity);
    };

    // Delegated: nothing has to register a listener per element.
    const onOver = (event) => {
      const tagged = event.target.closest?.('[data-cursor]');
      if (tagged) {
        setVariant(tagged.dataset.cursor || 'link');
        setLabel(tagged.dataset.cursorLabel || '');
        return;
      }
      if (event.target.closest?.('a, button, [role="button"], .tag')) {
        setVariant('link');
        setLabel('');
        return;
      }
      setVariant(event.target.closest?.('h1, h2, h3, p, li') ? 'text' : 'idle');
      setLabel('');
    };

    const onLeave = () => opacity.set(0);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [reduce, opacity, x, y]);

  useEffect(() => {
    const shape = VARIANTS[variant] || VARIANTS.idle;
    scale.set(shape.scale);
    if (enabled.current && opacity.get() !== 0) opacity.set(shape.opacity);
  }, [variant, scale, opacity]);

  if (reduce) return null;

  return (
    <motion.div
      className="cursor"
      data-variant={variant}
      aria-hidden="true"
      style={{ width: BASE, height: BASE, transform, opacity: sOpacity }}
    >
      {label && (
        <motion.span className="cursor__label" style={{ transform: labelTransform }}>
          {label}
        </motion.span>
      )}
    </motion.div>
  );
}
