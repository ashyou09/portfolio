import Section from '../components/Section';
import Button from '../components/Button';
import personalInfo from '../data/personalInfo';
import '../styles/About.css';

/**
 * About Section Component
 * 
 * This component renders the About section of the portfolio, which provides
 * detailed information about the portfolio owner, including:
 * - Professional background
 * - Personal interests
 * - Education and experience
 * - Resume download
 * 
 * @returns {JSX.Element} The About section component
 */
function About() {
  return (
    <Section
      id="about"
      title="About Me"
      subtitle="Get to know more about me and my background"
    >
      <div className="about-container">
        {/* Profile Image */}
        <div className="about-image-container">
          <div className="about-image-wrapper">
            {/* Replace with actual image path */}
            <img 
              src="/images/profile.jpg" 
              alt={personalInfo.name} 
              className="about-image"
              // Fallback if image doesn't load
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400x500?text=Profile+Image';
              }}
            />
          </div>
          <div className="about-image-backdrop"></div>
        </div>
        
        {/* About Content */}
        <div className="about-content">
          <h3 className="about-greeting">Hello there! I'm {personalInfo.name}</h3>
          
          {/* Long Bio - Split into paragraphs */}
          <div className="about-bio">
            {personalInfo.longBio.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          
          {/* Personal Info List */}
          <div className="about-info">
            <div className="about-info-item">
              <span className="about-info-label">Name:</span>
              <span className="about-info-value">{personalInfo.name}</span>
            </div>
            
            <div className="about-info-item">
              <span className="about-info-label">Email:</span>
              <span className="about-info-value">
                <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
              </span>
            </div>
            
            {personalInfo.phone && (
              <div className="about-info-item">
                <span className="about-info-label">Phone:</span>
                <span className="about-info-value">
                  <a href={`tel:${personalInfo.phone}`}>{personalInfo.phone}</a>
                </span>
              </div>
            )}
            
            <div className="about-info-item">
              <span className="about-info-label">Location:</span>
              <span className="about-info-value">{personalInfo.location}</span>
            </div>
          </div>
          
          {/* Interests */}
          <div className="about-interests">
            <h4 className="about-interests-title">My Interests</h4>
            <ul className="about-interests-list">
              {personalInfo.interests.map((interest, index) => (
                <li key={index} className="about-interest-item">{interest}</li>
              ))}
            </ul>
          </div>
          
          {/* Resume Button */}
          {personalInfo.resumeLink && (
            <div className="about-resume">
              <Button 
                href={personalInfo.resumeLink} 
                type="primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Resume
              </Button>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

export default About;