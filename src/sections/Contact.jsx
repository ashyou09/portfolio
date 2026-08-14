import { ArrowUpRight, PaperPlaneTilt } from '@phosphor-icons/react';
import Reveal from '../components/Reveal';
import BrandIcon from '../components/BrandIcon';
import profile from '../data/profile';
import '../styles/contact.css';

const SOCIALS = [
  { key: 'github', slug: 'siGithub', label: 'GitHub', handle: 'ashyou09' },
  { key: 'linkedin', slug: 'siLinkedin', label: 'LinkedIn', handle: 'ashutosh-singh2024' },
  { key: 'kaggle', slug: 'siKaggle', label: 'Kaggle', handle: 'Datasets Expert' },
  { key: 'leetcode', slug: 'siLeetcode', label: 'LeetCode', handle: 'ash_you09' },
  { key: 'codechef', slug: 'siCodechef', label: 'CodeChef', handle: 'glam_coyote_71' },
];

export default function Contact() {
  return (
    <section className="section section--hairline contact" id="contact">
      <div className="shell contact__grid">
        <div>
          <Reveal as="h2" className="contact__title">
            Hiring, or just
            <br />
            <em>curious?</em>
          </Reveal>
          <Reveal as="p" className="contact__lede" delay={0.08}>
            I am open to AI and ML internships and to collaborating on agent tooling. Mail lands
            fastest.
          </Reveal>
          <Reveal delay={0.14}>
            <a className="contact__mail" href={`mailto:${profile.email}`}>
              <PaperPlaneTilt size={18} />
              {profile.email}
            </a>
          </Reveal>
        </div>

        <Reveal className="contact__aside" delay={0.1}>
          <div>
            <p className="contact__label">Elsewhere</p>
            <div className="contact__socials">
              {SOCIALS.map((item) => (
                <a
                  key={item.key}
                  href={profile.social[item.key]}
                  target="_blank"
                  rel="noreferrer"
                >
                  <BrandIcon slug={item.slug} name={item.label} size={17} />
                  {item.label}
                  <ArrowUpRight className="grow" size={14} weight="bold" />
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
