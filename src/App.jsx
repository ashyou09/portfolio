import Nav from './components/Nav';
import Cursor from './components/Cursor';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import StackMarquee from './sections/StackMarquee';
import About from './sections/About';
import Experience from './sections/Experience';
import Work from './sections/Work';
import Network from './sections/Network';
import Lab from './sections/Lab';
import Certifications from './sections/Certifications';
import Contact from './sections/Contact';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#about">
        Skip to content
      </a>

      <Nav />

      <main>
        <Hero />
        <StackMarquee />
        <About />
        <Experience />
        <Work />
        <Network />
        <Lab />
        <Certifications />
        <Contact />
      </main>

      <Footer />
      <Cursor />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
