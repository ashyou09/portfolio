import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import './App.css';

/**
 * App Component
 * 
 * This is the main component that integrates all sections of the portfolio.
 * It includes:
 * - Header with navigation
 * - Hero section
 * - About section
 * - Skills section
 * - Projects section
 * - Contact section
 * - Footer
 * 
 * @returns {JSX.Element} The complete portfolio application
 */
function App() {
  /**
   * Smooth scroll to section when clicking on navigation links
   */
  useEffect(() => {
    // Get all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    // Add click event listener to each anchor link
    anchorLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        // Prevent default anchor click behavior
        e.preventDefault();

        // Get the target section id from the href attribute
        const targetId = this.getAttribute('href');

        // If the target is just "#", scroll to top
        if (targetId === '#') {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          return;
        }

        // Find the target element
        const targetElement = document.querySelector(targetId);

        // If target element exists, scroll to it
        if (targetElement) {
          // Get header height for offset (with a small extra padding)
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          const scrollPadding = 20;

          // Calculate the target position
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - scrollPadding;

          // Scroll to the target position
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    // Clean up event listeners on component unmount
    return () => {
      anchorLinks.forEach(link => {
        link.removeEventListener('click', () => { });
      });
    };
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <Hero />

        {/* About Section */}
        <About />

        {/* Skills Section */}
        <Skills />

        {/* Projects Section */}
        <Projects />

        {/* Contact Section */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;