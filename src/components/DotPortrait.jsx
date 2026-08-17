import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import portrait from '/me.jpg';
import '../styles/portrait.css';

/**
 * Halftone portrait: the photo is resampled onto a dot grid, then the dots
 * fly in from a scatter once the block scrolls into view. Motivation: a
 * plain headshot would be the only photographic surface on the page — the
 * grid keeps it in the same visual language as the network and loss curve.
 */

// Square crop over the face/shoulders of the source portrait (719x1280).
const CROP = { x: 78, y: 148, size: 566 };
const GAMMA = 1.15;
const FLOOR = 0.1; // luminance below this is background — no dot
const IN_DURATION = 1500;

export default function DotPortrait({
  size = 128,
  caption = 'Ashutosh Singh',
  className = '',
  // The grid follows the size: a bigger portrait gets more, finer dots, so it
  // reads as a resolved face rather than a handful of blocks.
  cols = Math.max(36, Math.min(104, Math.round(size / 2.05))),
}) {
  const canvasRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let dots = [];
    let raf = 0;
    let start = 0;
    let box = canvas.getBoundingClientRect();
    const pointer = { x: -999, y: -999, active: false };
    let cancelled = false;

    const sample = (img) => {
      const size = canvas.clientWidth;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.scale(dpr, dpr);

      const step = size / cols;
      const off = document.createElement('canvas');
      off.width = cols;
      off.height = cols;
      const octx = off.getContext('2d', { willReadFrequently: true });
      octx.drawImage(img, CROP.x, CROP.y, CROP.size, CROP.size, 0, 0, cols, cols);
      const { data } = octx.getImageData(0, 0, cols, cols);

      const center = size / 2;
      const next = [];

      for (let row = 0; row < cols; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const i = (row * cols + col) * 4;
          const lum =
            (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
          if (lum < FLOOR) continue;

          const x = col * step + step / 2;
          const y = row * step + step / 2;
          // Vignette so the crop dissolves at the edges instead of ending
          // on a hard square border.
          const d = Math.hypot(x - center, y - center) / center;
          const fade = 1 - Math.min(1, Math.max(0, (d - 0.68) / 0.32));
          if (fade <= 0) continue;

          const v = Math.pow(lum, GAMMA);
          const angle = Math.random() * Math.PI * 2;
          const spread = size * (0.35 + Math.random() * 0.5);

          next.push({
            x,
            y,
            ox: center + Math.cos(angle) * spread,
            oy: center + Math.sin(angle) * spread,
            r: step * 0.52 * v * fade,
            a: (0.22 + v * 0.78) * fade,
            // Stagger top-to-bottom so the face resolves before the shoulders.
            delay: (y / size) * 0.45 + Math.random() * 0.12,
            px: 0,
            py: 0,
          });
        }
      }
      dots = next;
    };

    const draw = (t) => {
      if (!start) start = t;
      const size = canvas.clientWidth;
      const elapsed = reduce ? 1 : (t - start) / IN_DURATION;

      ctx.clearRect(0, 0, size, size);

      let settling = false;

      for (let i = 0; i < dots.length; i += 1) {
        const dot = dots[i];
        const local = Math.min(1, Math.max(0, (elapsed - dot.delay) / 0.62));
        if (local < 1) settling = true;
        const e = 1 - Math.pow(1 - local, 3);

        let x = dot.ox + (dot.x - dot.ox) * e;
        let y = dot.oy + (dot.y - dot.oy) * e;

        // Pointer pushes dots aside, then they spring back.
        let tx = 0;
        let ty = 0;
        if (pointer.active) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const dist = Math.hypot(dx, dy);
          const reach = size * 0.28;
          if (dist < reach && dist > 0.001) {
            const push = (1 - dist / reach) ** 2 * size * 0.14;
            tx = (dx / dist) * push;
            ty = (dy / dist) * push;
          }
        }
        dot.px += (tx - dot.px) * 0.14;
        dot.py += (ty - dot.py) * 0.14;
        if (Math.abs(dot.px) > 0.05 || Math.abs(dot.py) > 0.05) settling = true;
        x += dot.px;
        y += dot.py;

        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.2, dot.r * e), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(233, 234, 236, ${dot.a * e})`;
        ctx.fill();
      }

      if (settling || pointer.active) {
        raf = requestAnimationFrame(draw);
      } else {
        raf = 0;
      }
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const img = new Image();
    img.src = portrait;

    const begin = () => {
      if (cancelled) return;
      sample(img);
      box = canvas.getBoundingClientRect();
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            start = 0;
            kick();
            io.disconnect();
          }
        },
        { threshold: 0.35 },
      );
      io.observe(canvas);
      canvas.__io = io;
    };

    if (img.complete) begin();
    else img.onload = begin;

    const onMove = (event) => {
      box = canvas.getBoundingClientRect();
      pointer.x = event.clientX - box.left;
      pointer.y = event.clientY - box.top;
      pointer.active = true;
      kick();
    };
    const onLeave = () => {
      pointer.active = false;
      kick();
    };
    const onResize = () => {
      if (!dots.length) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      sample(img);
      start = 0;
      kick();
    };

    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', onResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      canvas.__io?.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, [reduce, cols]);

  return (
    <figure className={`portrait ${className}`.trim()}>
      <canvas
        ref={canvasRef}
        className="portrait__canvas"
        style={{ '--portrait-size': `${size}px` }}
        aria-hidden="true"
      />
      {caption ? <figcaption className="portrait__cap">{caption}</figcaption> : null}
    </figure>
  );
}
