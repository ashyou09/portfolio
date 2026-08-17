import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowsClockwise,
  Plus,
  Minus,
  MagnifyingGlass,
} from '@phosphor-icons/react';
import Reveal from '../components/Reveal';
import SceneBoundary from '../components/SceneBoundary';
import { DATASETS, ARCHITECTURE_LIMITS, countParameters } from '../three/mlp';
import '../styles/network.css';

// The WebGL bundle is large and nothing above it depends on it, so it loads
// after the copy has painted.
const LiveNetwork = lazy(() => import('../three/LiveNetwork'));

const DATASET_KEYS = Object.keys(DATASETS);

/*
 * A network training in the open: pick a dataset, change the shape of the
 * model, watch the loss move. It used to sit in the hero, which meant it was
 * carrying the first impression and an interactive toy at once. Down here it
 * only has to be the second.
 */

export default function Network() {
  const stage = useRef(null);
  const [armed, setArmed] = useState(false);
  const [dataset, setDataset] = useState('circles');
  const [hidden, setHidden] = useState([4]);
  const [annotate, setAnnotate] = useState('nodes');
  const [resetKey, setResetKey] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [stats, setStats] = useState({ epoch: 0, loss: 0, accuracy: 0 });
  const [history, setHistory] = useState([]);

  const { minHiddenLayers, maxHiddenLayers, minUnits, maxUnits } = ARCHITECTURE_LIMITS;
  const sizes = [2, ...hidden, 1];
  const parameters = countParameters(sizes);
  const nodeCount = sizes.reduce((sum, size) => sum + size, 0);
  const edgeCount = sizes.slice(1).reduce((sum, size, i) => sum + size * sizes[i], 0);

  // Annotations only fit on a small network. Say so rather than letting the
  // labels pile into an unreadable heap.
  const annotationHidden =
    (annotate === 'nodes' && nodeCount > 18) || (annotate === 'weights' && edgeCount > 22);

  // A second WebGL context on the page, so it waits until it is nearly in view.
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

  const addLayer = () =>
    setHidden((layers) =>
      layers.length >= maxHiddenLayers ? layers : [...layers, layers.at(-1) ?? 6]
    );

  const removeLayer = () =>
    setHidden((layers) => (layers.length <= minHiddenLayers ? layers : layers.slice(0, -1)));

  const changeUnits = (index, delta) =>
    setHidden((layers) =>
      layers.map((units, i) =>
        i === index ? Math.min(maxUnits, Math.max(minUnits, units + delta)) : units
      )
    );

  // Called from inside the render loop, so it must not change identity.
  const onStats = useCallback((next) => {
    setStats(next);
    setHistory((values) => [...values.slice(-59), next.loss]);
  }, []);

  // Reset the curve whenever the run restarts.
  useEffect(() => setHistory([]), [dataset, resetKey, hidden.length]);

  // Loss is unbounded above, so the curve is scaled to its own run.
  const curve = (() => {
    if (history.length < 2) return '';
    const peak = Math.max(...history, 0.12);
    return history
      .map((value, i) => {
        const x = (i / (history.length - 1)) * 100;
        const y = 26 - Math.min(value / peak, 1) * 24;
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  })();

  return (
    <section className="section section--hairline" id="network">
      <div className="shell">
        <div className="work__head">
          <Reveal as="h2" className="h2">
            A network, training.
          </Reveal>
          <Reveal as="p" className="work__count" delay={0.1}>
            Drag to turn it
          </Reveal>
        </div>

        <Reveal className="lab-panel" delay={0.08}>
          <div className="lab-panel__bar">
            <p className="lab-panel__title">
              {sizes.join(' - ')} network, {parameters} parameters
            </p>
            <div className="lab-panel__sets">
              <label className="lab-panel__annotate">
                <span>Fit</span>
                <select value={dataset} onChange={(event) => setDataset(event.target.value)}>
                  {DATASET_KEYS.map((key) => (
                    <option key={key} value={key}>
                      {DATASETS[key].label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className="chip chip--icon"
                onClick={() => setResetKey((value) => value + 1)}
                aria-label="Reinitialise the weights and train again"
              >
                <ArrowsClockwise size={14} weight="bold" />
              </button>
            </div>
          </div>

          <div className="lab-panel__stage" ref={stage}>
            <div className="lab-panel__canvas">
              {armed ? (
                <SceneBoundary
                  fallback={
                    <div className="lab-panel__loading">
                      <span>This model needs WebGL, which is switched off.</span>
                    </div>
                  }
                >
                  <Suspense
                    fallback={
                      <div className="lab-panel__loading">
                        <span>Initialising weights</span>
                        <div className="lab__bar" />
                      </div>
                    }
                  >
                    <LiveNetwork
                      dataset={dataset}
                      hidden={hidden}
                      annotate={annotate}
                      resetKey={resetKey}
                      zoom={zoom}
                      onStats={onStats}
                    />
                  </Suspense>
                </SceneBoundary>
              ) : (
                <div className="lab-panel__loading">
                  <span>Scroll a little further to load it</span>
                </div>
              )}
            </div>
          </div>

          <div className="lab-panel__arch">
            <span className="lab-panel__archlabel">Hidden layers</span>

            <div className="lab-panel__layers">
              {hidden.map((units, index) => (
                // Layers have no identity beyond their position, so the index
                // is the only key available here.
                <span className="unit" key={index}>
                  <button
                    type="button"
                    onClick={() => changeUnits(index, -1)}
                    disabled={units <= minUnits}
                    aria-label={`Remove a neuron from hidden layer ${index + 1}`}
                  >
                    <Minus size={11} weight="bold" />
                  </button>
                  <b>{units}</b>
                  <button
                    type="button"
                    onClick={() => changeUnits(index, 1)}
                    disabled={units >= maxUnits}
                    aria-label={`Add a neuron to hidden layer ${index + 1}`}
                  >
                    <Plus size={11} weight="bold" />
                  </button>
                </span>
              ))}
              {hidden.length === 0 && <span className="unit unit--empty">none</span>}
            </div>

            <label className="lab-panel__annotate">
              <span>Show</span>
              <select value={annotate} onChange={(event) => setAnnotate(event.target.value)}>
                <option value="off">Nothing</option>
                <option value="nodes">Neuron labels</option>
                <option value="weights">Weight values</option>
              </select>
            </label>

            <label className="lab-panel__zoom">
              <MagnifyingGlass size={13} weight="bold" />
              <span className="visually-hidden">Model size</span>
              <input
                type="range"
                min="0.55"
                max="1.8"
                step="0.05"
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
              />
              <b>{zoom.toFixed(2)}x</b>
            </label>

            <div className="lab-panel__depth">
              <button
                type="button"
                className="chip"
                onClick={removeLayer}
                disabled={hidden.length <= minHiddenLayers}
              >
                <Minus size={11} weight="bold" /> Layer
              </button>
              <button
                type="button"
                className="chip"
                onClick={addLayer}
                disabled={hidden.length >= maxHiddenLayers}
              >
                <Plus size={11} weight="bold" /> Layer
              </button>
            </div>
          </div>

          {annotationHidden && (
            <p className="lab-panel__hint">
              Too many {annotate === 'weights' ? 'connections' : 'neurons'} to label. Drop a layer
              or shrink one to read them.
            </p>
          )}

          <dl className="lab-panel__readout">
            <div>
              <dt>Step</dt>
              <dd>{stats.epoch.toLocaleString()}</dd>
            </div>
            <div className="lab-panel__loss">
              <dt>Loss</dt>
              <dd>{stats.loss.toFixed(3)}</dd>
              {curve && (
                <svg className="spark" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true">
                  <path d={curve} fill="none" stroke="var(--accent)" strokeWidth="1.4"
                    vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <div>
              <dt>Batch accuracy</dt>
              <dd>{Math.round(stats.accuracy * 100)}%</dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
