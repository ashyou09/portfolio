import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Sun, MoonStars, GithubLogo } from '@phosphor-icons/react';
import Reveal from '../components/Reveal';
import SceneBoundary from '../components/SceneBoundary';
import '../styles/lab.css';

const PortTwin = lazy(() => import('../three/PortTwin'));

const REPO = 'https://github.com/ashyou09/3D-Port-visulaization';

export default function Lab() {
  const stage = useRef(null);
  const [armed, setArmed] = useState(false);
  const [night, setNight] = useState(false);

  // The second WebGL context is only created once the section is close to
  // the viewport. Two live canvases from first paint is not worth the cost.
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

  const failure = (
    <div className="lab__state">
      <strong>This scene needs WebGL, and your browser has it switched off.</strong>
      <a className="link-pill" href={REPO} target="_blank" rel="noreferrer">
        <GithubLogo size={15} weight="fill" />
        Read the source instead
      </a>
    </div>
  );

  return (
    <section className="lab" id="lab">
      <div className="shell lab__head">
        <Reveal as="h2" className="h2">
          Drag it around.
        </Reveal>
        <Reveal as="p" className="lede" delay={0.08} style={{ marginTop: '1rem' }}>
          A cut-down build of the port twin, running live on this page. Cranes work the berth,
          trucks run the quay road, and the lighting rig switches between day and night.
        </Reveal>
      </div>

      <div className="lab__stage" ref={stage}>
        {armed ? (
          <SceneBoundary fallback={failure}>
            <Suspense
              fallback={
                <div className="lab__state">
                  <strong>Building the terminal</strong>
                  <div className="lab__bar" />
                </div>
              }
            >
              <PortTwin night={night} />
            </Suspense>
          </SceneBoundary>
        ) : (
          <div className="lab__state">
            <strong>Scene ready</strong>
            <span>Scroll a little further to load it</span>
          </div>
        )}

        <div className="lab__overlay">
          <div className="lab__readout">
            <div>
              Berth cranes
              <b>3</b>
            </div>
            <div>
              Vehicles in full build
              <b>400+</b>
            </div>
            <div>
              Traffic cycle
              <b>24 h</b>
            </div>
          </div>

          <div className="lab__controls">
            <button
              type="button"
              className="lab__toggle"
              aria-pressed={!night}
              onClick={() => setNight(false)}
            >
              <Sun size={15} weight="fill" />
              Day
            </button>
            <button
              type="button"
              className="lab__toggle"
              aria-pressed={night}
              onClick={() => setNight(true)}
            >
              <MoonStars size={15} weight="fill" />
              Night
            </button>
          </div>
        </div>
      </div>

      <p className="shell lab__hint">
        Drag to orbit, scroll to zoom. The full simulator adds rain, cinematic camera and a live
        TomTom traffic feed.
      </p>
    </section>
  );
}
