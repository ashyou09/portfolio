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
    { name: "HTML", level: 5, icon: "html5" },
    { name: "CSS", level: 5, icon: "css3" },
    { name: "JavaScript", level: 4, icon: "javascript" },
    { name: "React", level: 4, icon: "react" },
    { name: "Tailwind CSS", level: 3, icon: "tailwind" },
  ],
  
  // Backend Development Skills
  backend: [
    { name: "Node.js", level: 3, icon: "nodejs" },
    { name: "Express.js", level: 3, icon: "express" },
    { name: "Python", level: 4, icon: "python" },
    { name: "FastAPI", level: 3, icon: "fastapi" },
    { name: "Supabase", level: 3, icon: "supabase" },
    { name: "MongoDB", level: 3, icon: "mongodb" },
    { name: "Firebase", level: 3, icon: "firebase" },
  ],
  
  // Data Science & Machine Learning
  datascience: [
    { name: "Machine Learning", level: 4, icon: "machinelearning" }, // Placeholder icon name
    { name: "NumPy", level: 4, icon: "numpy" },
    { name: "Pandas", level: 4, icon: "pandas" },
    { name: "Matplotlib", level: 3, icon: "matplotlib" },
    { name: "Scikit-learn", level: 3, icon: "scikitlearn" },
    { name: "Generative AI", level: 4, icon: "ai" },
  ],
  
  // DevOps & Tools
  devops: [
    { name: "Git", level: 4, icon: "git" },
    { name: "Vite", level: 3, icon: "vite" },
  ],
  
  // Design Skills
  design: [
    { name: "Figma", level: 3, icon: "figma" },
    { name: "UI/UX Design", level: 3, icon: "uiux" },
    { name: "Responsive Design", level: 5, icon: "responsive" },
  ],
  
  // Soft Skills
  soft: [
    { name: "Critical Thinking", level: 5, icon: "criticalthinking" },
    { name: "Problem Solving", level: 5, icon: "problemsolving" },
    { name: "Communication", level: 4, icon: "communication" },
    { name: "Teamwork", level: 5, icon: "teamwork" },
    { name: "Time Management", level: 4, icon: "timemanagement" },
    { name: "Adaptability", level: 5, icon: "adaptability" },
  ]
};

export default skills;