import { useState } from 'react';
import Section from '../components/Section';
import Button from '../components/Button';
import personalInfo from '../data/personalInfo';
import '../styles/Contact.css';

/**
 * Contact Section Component
 * 
 * This component renders the Contact section of the portfolio, providing
 * a contact form and additional contact information.
 * 
 * Features:
 * - Contact form with validation
 * - Social media links
 * - Direct contact information
 * - Form submission handling
 * 
 * @returns {JSX.Element} The Contact section component
 */
function Contact() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState({ success: false, message: '' });
  const [formErrors, setFormErrors] = useState({});
  
  /**
   * Handle form input changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };
  
  /**
   * Validate form data
   * @returns {boolean} Whether the form is valid
   */
  const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    
    // Subject validation
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    
    // Message validation
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  /**
   * Handle form submission
   * @param {Event} e - Form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Set submitting state
    setIsSubmitting(true);
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitResult({
        success: true,
        message: 'Your message has been sent successfully! I will get back to you soon.'
      });
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitResult({ success: false, message: '' });
      }, 5000);
    }, 1500);
  };
  
  return (
    <Section
      id="contact"
      title="Contact Me"
      subtitle="Have a question or want to work together? Feel free to reach out!"
    >
      <div className="contact-container">
        {/* Contact Information */}
        <div className="contact-info">
          <h3 className="contact-info-title">Get In Touch</h3>
          <p className="contact-info-text">
            I'm currently available for freelance work, full-time positions, or collaborations.
            Feel free to reach out using the form or through any of the methods below.
          </p>
          
          {/* Direct Contact Details */}
          <div className="contact-details">
            {/* Email */}
            <div className="contact-detail-item">
              <div className="contact-icon">
                <span className="icon-placeholder">✉</span>
              </div>
              <div className="contact-detail-content">
                <h4>Email</h4>
                <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
              </div>
            </div>
            
            {/* Phone (if available) */}
            {personalInfo.phone && (
              <div className="contact-detail-item">
                <div className="contact-icon">
                  <span className="icon-placeholder">☎</span>
                </div>
                <div className="contact-detail-content">
                  <h4>Phone</h4>
                  <a href={`tel:${personalInfo.phone}`}>{personalInfo.phone}</a>
                </div>
              </div>
            )}
            
            {/* Location */}
            <div className="contact-detail-item">
              <div className="contact-icon">
                <span className="icon-placeholder">📍</span>
              </div>
              <div className="contact-detail-content">
                <h4>Location</h4>
                <p>{personalInfo.location}</p>
              </div>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="contact-social">
            <h4 className="contact-social-title">Connect With Me</h4>
            <div className="contact-social-links">
              {personalInfo.social.github && (
                <a href={personalInfo.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <span className="social-icon github">GitHub</span>
                </a>
              )}
              {personalInfo.social.linkedin && (
                <a href={personalInfo.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <span className="social-icon linkedin">LinkedIn</span>
                </a>
              )}
              {personalInfo.social.twitter && (
                <a href={personalInfo.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <span className="social-icon twitter">Twitter</span>
                </a>
              )}
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="contact-form-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            {/* Form Result Message */}
            {submitResult.message && (
              <div className={`form-result ${submitResult.success ? 'success' : 'error'}`}>
                {submitResult.message}
              </div>
            )}
            
            {/* Name Input */}
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className={formErrors.name ? 'error' : ''}
              />
              {formErrors.name && <span className="error-message">{formErrors.name}</span>}
            </div>
            
            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className={formErrors.email ? 'error' : ''}
              />
              {formErrors.email && <span className="error-message">{formErrors.email}</span>}
            </div>
            
            {/* Subject Input */}
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className={formErrors.subject ? 'error' : ''}
              />
              {formErrors.subject && <span className="error-message">{formErrors.subject}</span>}
            </div>
            
            {/* Message Input */}
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows="5"
                className={formErrors.message ? 'error' : ''}
              ></textarea>
              {formErrors.message && <span className="error-message">{formErrors.message}</span>}
            </div>
            
            {/* Submit Button */}
            <div className="form-submit">
              <Button type="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Section>
  );
}

export default Contact;