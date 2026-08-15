import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowDownRight, FileText, ArrowsClockwise, Plus, Minus } from '@phosphor-icons/react';
import Magnetic from '../components/Magnetic';
import profile from '../data/profile';
import { DATASETS, ARCHITECTURE_LIMITS, countParameters } from '../three/mlp';
import '../styles/hero.css';

// The WebGL bundle is large and nothing above it depends on it, so it loads
// after the copy has painted.
const LiveNetwork = lazy(() => import('../three/LiveNetwork'));

const DATASET_KEYS = Object.keys(DATASETS);

export default function Hero() {
  const reduce = useReducedMotion();
  const [dataset, setDataset] = useState('circles');
  const [hidden, setHidden] = useState([4]);
  const [annotate, setAnnotate] = useState('nodes');
  const [resetKey, setResetKey] = useState(0);
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

  const line = (index) => ({
    initial: reduce ? false : { y: '110%' },
    animate: { y: '0%' },
    transition: { duration: 0.9, delay: 0.1 + index * 0.09, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <section className="hero" id="top">
      <div className="hero__glow" aria-hidden="true" />

      <div className="hero__inner shell">
        <div className="hero__body">
          <motion.p
            className="eyebrow"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {profile.role}
          </motion.p>

          <h1 className="hero__title">
            <span className="hero__line">
              <motion.span {...line(0)}>{profile.headline[0]}</motion.span>
            </span>
            <span className="hero__line">
              <motion.span {...line(1)}>
                <em>{profile.headline[1]}</em>
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="hero__sub"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42 }}
          >
            {profile.subtext}
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.54 }}
          >
            <Magnetic>
              <a className="btn btn--primary" href="#work">
                View work
                <ArrowDownRight size={17} weight="bold" />
              </a>
            </Magnetic>
            <Magnetic strength={0.22}>
              <a className="btn btn--ghost" href={profile.resume} target="_blank" rel="noreferrer">
                <FileText size={17} />
                Resume
              </a>
            </Magnetic>
          </motion.div>
        </div>

        <motion.div
          className="lab-panel"
          initial={reduce ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="lab-panel__bar">
            <p className="lab-panel__title">
              {[2, ...hidden, 1].join(' - ')} network, {parameters} parameters
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

          <div className="lab-panel__stage">
            <div className="lab-panel__canvas">
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
                onStats={onStats}
              />
            </Suspense>
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
        </motion.div>
      </div>
    </section>
  );
}
