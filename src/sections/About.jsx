import Reveal from '../components/Reveal';
import profile from '../data/profile';
import '../styles/about.css';

export default function About() {
  const { about, education, stats } = profile;

  return (
    <section className="section section--hairline" id="about">
      <div className="shell about__grid">
        <div className="about__copy">
          <Reveal as="h2" className="h2 about__title">
            Reinforcement learning
            <br />
            meets language models.
          </Reveal>
          {about.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 24)} as="p" delay={0.08 + index * 0.08}>
              {paragraph}
            </Reveal>
          ))}
        </div>

        <Reveal className="about__aside" delay={0.12}>
          <div className="about__edu">
            <h3>{education.degree}</h3>
            <p>{education.school}</p>
            <dl>
              <div>
                <dt>Period</dt>
                <dd>{education.period}</dd>
              </div>
              <div>
                <dt>Standing</dt>
                <dd>{education.grade}</dd>
              </div>
            </dl>
          </div>

          <div className="about__stats">
            {stats.map((stat) => (
              <div className="about__stat" key={stat.label}>
                <b>{stat.value}</b>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
