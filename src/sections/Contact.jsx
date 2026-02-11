import { useState } from 'react';
import Section from '../components/Section';
import Button from '../components/Button';
import personalInfo from '../data/personalInfo';
import '../styles/Contact.css';

function Contact() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    message: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    if (formErrors[name]) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Construct mailto link
    const { name, subject, message } = formData;
    const emailSubject = encodeURIComponent(`${subject} - from ${name}`);
    const emailBody = encodeURIComponent(`Name: ${name}\n\nMessage:\n${message}`);

    // Open default mail client
    window.location.href = `mailto:${personalInfo.email}?subject=${emailSubject}&body=${emailBody}`;

    // Optional: clear form or show success message (though mailto happens outside app)
    // We'll just leave the form as is so they can see what they wrote if needed, 
    // or we could clear it. Let's keep it simple.
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

            {/* Email Input REMOVED as requested */}

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
              <Button type="primary">
                Send Email
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Section>
  );
}

export default Contact;
