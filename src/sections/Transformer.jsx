import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import Reveal from '../components/Reveal';
import SceneBoundary from '../components/SceneBoundary';
import '../styles/transformer.css';

const TransformerStack = lazy(() => import('../three/TransformerStack'));

/*
 * The architecture I work in, as an object rather than a diagram. Model on the
 * left, its parts on the right; picking a part lifts it in the model and dims
 * everything else.
 */

const PARTS = [
  {
    id: 'embed',
    label: 'Token embeddings',
    note: 'Each token becomes a vector, with position added on top.',
  },
  {
    id: 'attention',
    label: 'Multi-head attention',
    note: 'Every token weighs every other token. The arcs are those weights.',
  },
  {
    id: 'ffn',
    label: 'Feed forward',
    note: 'Each position is transformed on its own, in parallel across the row.',
  },
  {
    id: 'residual',
    label: 'Residual stream',
    note: 'The column each token rides, carrying its state up through the block.',
  },
  {
    id: 'output',
    label: 'Output head',
    note: 'The top row projects back out to a distribution over the vocabulary.',
  },
];

export default function Transformer() {
  const stage = useRef(null);
  const [armed, setArmed] = useState(false);
  const [part, setPart] = useState('attention');

  // Third WebGL context on the page, so it waits until it is nearly in view.
  useEffect(() => {
    const node = stage.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section section--hairline" id="transformer">
      <div className="shell">
        <div className="work__head">
          <Reveal as="h2" className="h2">
            The architecture I build on.
          </Reveal>
          <Reveal as="p" className="work__count" delay={0.1}>
            Drag to turn it
          </Reveal>
        </div>

        <Reveal className="tf" delay={0.08}>
          <div className="tf__stage" ref={stage}>
            {armed ? (
              <SceneBoundary
                fallback={
                  <div className="tf__state">This model needs WebGL, which is switched off.</div>
                }
              >
                <Suspense fallback={<div className="tf__state">Assembling the block</div>}>
                  <TransformerStack part={part} />
                </Suspense>
              </SceneBoundary>
            ) : (
              <div className="tf__state">Scroll a little further to load it</div>
            )}
          </div>

          <ul className="tf__parts">
            {PARTS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="tf__part"
                  aria-pressed={part === item.id}
                  onClick={() => setPart(item.id)}
                >
                  <b>{item.label}</b>
                  <span>{item.note}</span>
                </button>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
