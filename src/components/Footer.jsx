import profile from '../data/profile';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <span>
          {profile.name}, {profile.location}
        </span>
        <span>
          Built with React, Three.js and Motion.{' '}
          <a href="https://github.com/ashyou09/portfolio" target="_blank" rel="noreferrer">
            Source
          </a>
        </span>
      </div>
    </footer>
  );
}
