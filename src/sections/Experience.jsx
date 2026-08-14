import Reveal from '../components/Reveal';
import experience from '../data/experience';
import '../styles/experience.css';

export default function Experience() {
  return (
    <section className="section section--hairline" id="experience">
      <div className="shell xp__grid">
        <div className="xp__head">
          <p className="eyebrow">Internships</p>
          <Reveal as="h2" className="h2">
            Where I have
            <br />
            shipped.
          </Reveal>
        </div>

        <ol className="xp__list">
          {experience.map((job, index) => (
            <Reveal as="li" className="xp__item" key={job.id} delay={index * 0.08}>
              <p className="xp__period mono">
                {job.period}
                <i>{job.mode}</i>
              </p>
              <h3 className="xp__role">{job.role}</h3>
              <p className="xp__company">{job.company}</p>
              <p className="xp__summary">{job.summary}</p>

              <ul className="xp__highlights">
                {job.highlights.map((point) => (
                  <li key={point.slice(0, 28)}>{point}</li>
                ))}
              </ul>

              <ul className="xp__stack">
                {job.stack.map((tool) => (
                  <li className="tag" key={tool}>
                    {tool}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
