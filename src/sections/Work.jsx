import { useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from 'motion/react';
import { ArrowUpRight, GithubLogo, CubeFocus, Plus, Minus } from '@phosphor-icons/react';
import Reveal from '../components/Reveal';
import { featured, more } from '../data/projects';
import '../styles/work.css';

/*
 * Projects deal like a deck: each card sticks under the nav while the next one
 * rises over it, and the outgoing card scales down and dims so the depth reads
 * as "behind", not "gone".
 *
 * Purpose: spatial consistency. Four dense projects as a flat list scrolls past
 * as an undifferentiated wall; stacked, each one gets the viewport to itself.
 *
 * Scroll position is read through Motion's useScroll, never a scroll listener,
 * and the transform is composed as a full string so it stays on the GPU.
 */

const NAV_OFFSET = 92;

function ProjectLinks({ project }) {
  return (
    <div className="links">
      {project.live && (
        <a className="link-pill" href={project.live} target="_blank" rel="noreferrer">
          Live demo
          <ArrowUpRight size={15} weight="bold" />
        </a>
      )}
      {project.scene && (
        <a className="link-pill" href="#lab">
          <CubeFocus size={15} weight="bold" />
          Open the scene
        </a>
      )}
      {project.github && (
        <a className="link-pill" href={project.github} target="_blank" rel="noreferrer">
          <GithubLogo size={15} weight="fill" />
          Source
        </a>
      )}
    </div>
  );
}

function StackCard({ project, index, total }) {
  const slot = useRef(null);
  const reduce = useReducedMotion();

  // Progress from "this card is parked at the top" to "it has been fully
  // covered by the next one".
  const { scrollYProgress } = useScroll({
    target: slot,
    offset: ['start start', 'end start'],
  });

  const scaleValue = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const transform = useMotionTemplate`scale(${scaleValue})`;
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.4]);
  const isLast = index === total - 1;

  return (
    <div
      className="stack__slot"
      ref={slot}
      style={{ top: `${NAV_OFFSET + index * 12}px` }}
    >
      <motion.article
        className="stack__card"
        style={reduce || isLast ? undefined : { transform, opacity }}
      >
        <div>
          <p className="stack__index">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            <i>{project.period}</i>
          </p>

          <h3 className="stack__title">{project.title}</h3>
          <p className="stack__blurb">{project.blurb}</p>

          {project.metric && (
            <div className="metric">
              <b>{project.metric.value}</b>
              <span>{project.metric.label}</span>
            </div>
          )}

          <ul className="stack__stack">
            {project.stack.slice(0, 5).map((tool) => (
              <li className="tag" key={tool}>
                {tool}
              </li>
            ))}
          </ul>

          <ProjectLinks project={project} />
        </div>

        <div className="stack__media" data-cursor="media" data-cursor-label={project.live ? 'Live' : 'Scene'}>
          {project.image ? (
            <img src={project.image} alt={project.imageAlt} loading="lazy" width="1440" height="900" />
          ) : (
            <div className="stack__scene">
              <b>{project.metric?.value}</b>
              <span>{project.metric?.label}</span>
            </div>
          )}
        </div>
      </motion.article>
    </div>
  );
}

/*
 * Everything past the featured four stays folded away. Purpose: state
 * indication, and keeping the page from ending in a long tail of older work.
 * The panel animates height because there is no transform equivalent for
 * "reveal this much content", which is the one sanctioned exception.
 */
function MoreWork() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div className="more">
      <button
        type="button"
        className="more__toggle"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <Minus size={14} weight="bold" /> : <Plus size={14} weight="bold" />}
        {open ? 'Hide earlier work' : `Earlier work (${more.length})`}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="more__panel"
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
          >
            <ul className="more__rail">
              {more.map((project) => (
                <li className="more__item" key={project.id}>
                  {/* Not every repo has a product screenshot. Fall back to a
                      typographic tile rather than a broken image. */}
                  {project.image ? (
                    <img src={project.image} alt="" loading="lazy" width="680" height="383" />
                  ) : (
                    <div className="more__tile" aria-hidden="true">
                      <span className="mono">{project.tile ?? project.stack[0]}</span>
                    </div>
                  )}
                  <div className="more__body">
                    <h4>{project.title}</h4>
                    <p>{project.blurb}</p>
                    <div className="more__links">
                      {project.live && (
                        <a href={project.live} target="_blank" rel="noreferrer">
                          Live
                        </a>
                      )}
                      <a href={project.github} target="_blank" rel="noreferrer">
                        Source
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Work() {
  return (
    <section className="section section--hairline" id="work">
      <div className="shell">
        <div className="work__head">
          <Reveal as="h2" className="h2">
            Selected work.
          </Reveal>
          <Reveal as="p" className="work__count" delay={0.1}>
            {featured.length + more.length} projects, {featured.length} worth your time
          </Reveal>
        </div>

        <div className="stack">
          {featured.map((project, index) => (
            <StackCard
              key={project.id}
              project={project}
              index={index}
              total={featured.length}
            />
          ))}
        </div>

        <MoreWork />
      </div>
    </section>
  );
}
