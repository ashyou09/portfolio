import { ArrowUpRight } from '@phosphor-icons/react';
import Reveal from '../components/Reveal';
import BrandIcon from '../components/BrandIcon';
import certifications from '../data/certifications';
import '../styles/certs.css';

export default function Certifications() {
  return (
    <section className="section section--hairline" id="certifications">
      <div className="shell">
        <p className="eyebrow">Certifications</p>
        <Reveal as="h2" className="h2">
          Verified, not claimed.
        </Reveal>

        <div className="certs__grid">
          {certifications.map((cert, index) => (
            <Reveal className="cert" key={cert.id} delay={index * 0.08}>
              <div className="cert__top">
                <span className="cert__issuer">
                  <BrandIcon slug={cert.icon} name={cert.issuer} size={22} tone="brand" />
                  {cert.issuer}
                </span>
                <span className="cert__date">{cert.date}</span>
              </div>

              <h3 className="cert__title">{cert.title}</h3>
              <p className="cert__blurb">{cert.blurb}</p>

              <ul className="cert__tracks">
                {cert.tracks.map((track) => (
                  <li className="tag" key={track}>
                    {track}
                  </li>
                ))}
              </ul>

              <div>
                <a className="link-pill" href={cert.verify} target="_blank" rel="noreferrer">
                  Verify
                  <ArrowUpRight size={15} weight="bold" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
