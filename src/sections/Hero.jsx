import { useEffect, useState } from 'react';
import Button from '../components/Button';
import personalInfo from '../data/personalInfo';
import '../styles/Hero.css';

/**
 * Hero Section Component
 * 
 * This component renders the hero section of the portfolio, which is the first section
 * visitors see. It includes a greeting, name, title, short bio, and call-to-action buttons.
 * 
 * Features:
 * - Animated text typing effect for the title
 * - Responsive design for all screen sizes
 * - Call-to-action buttons for important links
 * - Subtle background animation
 * 
 * @returns {JSX.Element} The Hero section component
 */
function Hero() {
  // State for animated typing effect
  const [displayText, setDisplayText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  
  // Text to be typed
  const textToType = personalInfo.title;
  
  /**
   * Animated typing effect for the title
   */
  useEffect(() => {
    let currentIndex = 0;
    let typingInterval;
    
    // Start typing effect
    const startTyping = () => {
      typingInterval = setInterval(() => {
        if (currentIndex <= textToType.length) {
          setDisplayText(textToType.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTypingComplete(true);
        }
      }, 100); // Adjust speed as needed
    };
    
    // Start typing after a short delay
    const initialDelay = setTimeout(() => {
      startTyping();
    }, 500);
    
    // Clean up intervals on component unmount
    return () => {
      clearTimeout(initialDelay);
      clearInterval(typingInterval);
    };
  }, [textToType]);
  
  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content">
        <div className="hero-text-container">
          {/* Greeting */}
          <p className="hero-greeting">Hello, I'm</p>
          
          {/* Name */}
          <h1 className="hero-name">{personalInfo.name}</h1>
          
          {/* Animated Title */}
          <div className="hero-title-container">
            <h2 className="hero-title">
              <span className="hero-title-text">{displayText}</span>
              <span className={`hero-cursor ${isTypingComplete ? 'blink' : ''}`}>|</span>
            </h2>
          </div>
          
          {/* Short Bio */}
          <p className="hero-bio">{personalInfo.bio}</p>
          
          {/* Call-to-Action Buttons */}
          <div className="hero-buttons">
            <Button href="#projects" type="primary" size="large">
              View My Work
            </Button>
            <Button href="#contact" type="outline" size="large">
              Contact Me
            </Button>
          </div>
          
          {/* Scroll Down Indicator */}
          <div className="scroll-indicator">
            <a href="#about" aria-label="Scroll to About section">
              <div className="mouse">
                <div className="wheel"></div>
              </div>
              <div className="arrow">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;