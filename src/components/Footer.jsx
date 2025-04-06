import { useState, useEffect } from 'react';
import '../styles/Footer.css';
import personalInfo from '../data/personalInfo';

/**
 * Footer Component
 * 
 * This component renders the footer section of the portfolio, including:
 * - Copyright information
 * - Social media links
 * - Quick navigation links
 * - Back to top button
 * 
 * @returns {JSX.Element} The Footer component
 */
function Footer() {
  // State for back to top button visibility
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // Get current year for copyright
  const currentYear = new Date().getFullYear();
  
  /**
   * Handle scroll event to show/hide back to top button
   */
  useEffect(() => {
    const handleScroll = () => {
      // Show button when page is scrolled down 300px
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  /**
   * Scroll to top of the page
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Footer Top Section */}
        <div className="footer-top">
          {/* Brand/Logo Section */}
          <div className="footer-brand">
            <h3 className="footer-title">Portfolio</h3>
            <p className="footer-description">
              A showcase of my skills, projects, and professional journey.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#skills">Skills</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div className="footer-contact">
            <h4>Contact</h4>
            <ul>
              <li>
                <span className="contact-label">Email:</span>
                <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
              </li>
              {personalInfo.phone && (
                <li>
                  <span className="contact-label">Phone:</span>
                  <a href={`tel:${personalInfo.phone}`}>{personalInfo.phone}</a>
                </li>
              )}
              <li>
                <span className="contact-label">Location:</span>
                <span>{personalInfo.location}</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Footer Bottom Section */}
        <div className="footer-bottom">
          {/* Copyright */}
          <div className="copyright">
            <p>&copy; {currentYear} {personalInfo.name}. All Rights Reserved.</p>
          </div>
          
          {/* Social Links */}
          <div className="social-links">
            {personalInfo.social.github && (
              <a href={personalInfo.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <i className="social-icon github">GitHub</i>
              </a>
            )}
            {personalInfo.social.linkedin && (
              <a href={personalInfo.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="social-icon linkedin">LinkedIn</i>
              </a>
            )}
            {personalInfo.social.twitter && (
              <a href={personalInfo.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="social-icon twitter">Twitter</i>
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* Back to Top Button */}
      <button 
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <span className="arrow-up">↑</span>
      </button>
    </footer>
  );
}

export default Footer;