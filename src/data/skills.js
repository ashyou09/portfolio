/**
 * Skills Data
 * 
 * This file contains an object of skill categories and their respective skills.
 * Each category contains an array of skill objects.
 * 
 * @property {object} categories - Object containing skill categories
 * @property {array} categories[category] - Array of skills for a specific category
 * @property {string} categories[category][].name - Name of the skill
 * @property {number} categories[category][].level - Proficiency level (1-5)
 * @property {string} categories[category][].icon - Optional icon name or path
 */

const skills = {
  // Frontend Development Skills
  frontend: [
    { name: "HTML5", level: 5, icon: "html5" },
    { name: "CSS3", level: 5, icon: "css3" },
    { name: "JavaScript", level: 5, icon: "javascript" },
    { name: "React", level: 4, icon: "react" },
    { name: "Redux", level: 4, icon: "redux" },
    { name: "TypeScript", level: 3, icon: "typescript" },
    { name: "Sass/SCSS", level: 4, icon: "sass" },
    { name: "Tailwind CSS", level: 4, icon: "tailwind" },
    { name: "Bootstrap", level: 4, icon: "bootstrap" },
  ],
  
  // Backend Development Skills
  backend: [
    { name: "Node.js", level: 4, icon: "nodejs" },
    { name: "Express.js", level: 4, icon: "express" },
    { name: "Python", level: 3, icon: "python" },
    { name: "Django", level: 3, icon: "django" },
    { name: "PHP", level: 3, icon: "php" },
    { name: "RESTful APIs", level: 4, icon: "api" },
    { name: "GraphQL", level: 3, icon: "graphql" },
  ],
  
  // Database Skills
  database: [
    { name: "MongoDB", level: 4, icon: "mongodb" },
    { name: "MySQL", level: 4, icon: "mysql" },
    { name: "PostgreSQL", level: 3, icon: "postgresql" },
    { name: "Firebase", level: 4, icon: "firebase" },
    { name: "Redis", level: 2, icon: "redis" },
  ],
  
  // DevOps & Tools
  devops: [
    { name: "Git", level: 4, icon: "git" },
    { name: "Docker", level: 3, icon: "docker" },
    { name: "AWS", level: 3, icon: "aws" },
    { name: "CI/CD", level: 3, icon: "cicd" },
    { name: "Webpack", level: 3, icon: "webpack" },
    { name: "Vite", level: 4, icon: "vite" },
  ],
  
  // Design Skills
  design: [
    { name: "Figma", level: 4, icon: "figma" },
    { name: "Adobe XD", level: 3, icon: "adobexd" },
    { name: "Photoshop", level: 3, icon: "photoshop" },
    { name: "UI/UX Design", level: 3, icon: "uiux" },
    { name: "Responsive Design", level: 4, icon: "responsive" },
  ],
  
  // Soft Skills
  soft: [
    { name: "Problem Solving", level: 5, icon: "problemsolving" },
    { name: "Communication", level: 4, icon: "communication" },
    { name: "Teamwork", level: 4, icon: "teamwork" },
    { name: "Time Management", level: 4, icon: "timemanagement" },
    { name: "Adaptability", level: 5, icon: "adaptability" },
  ]
};

export default skills;