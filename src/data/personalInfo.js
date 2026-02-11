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
  name: "Ashutosh Singh",
  title: "Front-End Developer",
  email: "ashutosh.singh2024@nst.rishihood.edu.in",
  location: "India",
  // phone: "", // Removed as requested
  
  // Short bio for hero section
  bio: "Dedicated Front-End Developer with multiple Projects, Real-World Problem Solver, always eager to learn, and Competitive Coding Experience.",
  
  // Detailed bio for about section
  longBio: `I am a Bachelor of Technology (Artificial Intelligence) student at Newton School of Technology, Rishihood University (2024-2028).
  
  I have a strong background in competitive coding with a Leetcode rating of 1500+ (160+ questions) and CodeChef rating of 1300+.
  
  I have completed specializations in Machine Learning from Stanford University & DeepLearning.AI, and have certifications in Python and C++ for Beginners.
  
  I am passionate about building impactful web applications and solving real-world problems through code.`,
  
  // Social media links
  social: {
    github: "https://github.com/ashyou09",
    linkedin: "https://www.linkedin.com/in/ashutosh-singh-877520320/",
    leetcode: "https://leetcode.com/u/ashyou09/",
    codechef: "https://www.codechef.com/users/ashyou09",
  },
  
  // Personal interests
  interests: [
    "Competitive Coding",
    "Web Development",
    "Machine Learning",
    "Generative AI",
    "Hackathons",
    "Olympiads"
  ],
  
  // Resume link
  resumeLink: "/resume.pdf" // Path to your resume file
};

export default personalInfo;