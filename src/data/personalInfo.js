/**
 * Personal Information Data
 * 
 * This file contains personal information that will be displayed throughout the portfolio.
 * Update this file with your own information to personalize your portfolio.
 * 
 * @property {string} name - Your full name
 * @property {string} title - Your professional title
 * @property {string} email - Your contact email
 * @property {string} location - Your location
 * @property {string} bio - A short biography
 * @property {string} longBio - A more detailed biography for the About section
 * @property {object} social - Object containing social media links
 * @property {string[]} interests - Array of personal interests
 */

const personalInfo = {
  name: "Your Name",
  title: "Full Stack Developer",
  email: "your.email@example.com",
  location: "City, Country",
  phone: "+1 (123) 456-7890", // Optional
  
  // Short bio for hero section
  bio: "I'm a passionate Full Stack Developer with expertise in React, Node.js, and modern web technologies.",
  
  // Detailed bio for about section
  longBio: `I'm a Full Stack Developer with over 5 years of experience building web applications.
  I specialize in JavaScript technologies across the stack, with a focus on React, Node.js, and modern frameworks.
  
  My journey in web development started when I built my first website in college, and I've been hooked ever since.
  I enjoy solving complex problems and creating intuitive, efficient user experiences.
  
  When I'm not coding, you can find me hiking, reading, or experimenting with new technologies.`,
  
  // Social media links
  social: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
    // Add more social links as needed
  },
  
  // Personal interests
  interests: [
    "Web Development",
    "Open Source",
    "UI/UX Design",
    "Artificial Intelligence",
    "Hiking",
    "Photography"
  ],
  
  // Resume link
  resumeLink: "/resume.pdf" // Path to your resume file
};

export default personalInfo;