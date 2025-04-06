/**
 * Projects Data
 * 
 * This file contains an array of project objects that will be displayed in the portfolio.
 * Each project object contains the following properties:
 * 
 * @property {string} id - Unique identifier for the project
 * @property {string} title - The title/name of the project
 * @property {string} description - A detailed description of the project
 * @property {string[]} technologies - Array of technologies used in the project
 * @property {string} image - Path to the project image
 * @property {string} githubLink - Link to the GitHub repository
 * @property {string} liveLink - Link to the live demo (if available)
 * @property {boolean} featured - Whether the project should be featured prominently
 */

const projects = [
  {
    id: "project1",
    title: "E-Commerce Platform",
    description: "A full-featured e-commerce platform built with React and Node.js. Includes user authentication, product catalog, shopping cart, and payment processing.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe API"],
    image: "/images/projects/ecommerce.jpg", // Placeholder path
    githubLink: "https://github.com/yourusername/ecommerce-platform",
    liveLink: "https://ecommerce-platform.example.com",
    featured: true
  },
  {
    id: "project2",
    title: "Weather Dashboard",
    description: "A weather dashboard that displays current weather conditions and forecasts for multiple locations. Uses the OpenWeather API for real-time data.",
    technologies: ["JavaScript", "HTML5", "CSS3", "OpenWeather API"],
    image: "/images/projects/weather-dashboard.jpg", // Placeholder path
    githubLink: "https://github.com/yourusername/weather-dashboard",
    liveLink: "https://weather-dashboard.example.com",
    featured: false
  },
  {
    id: "project3",
    title: "Task Management App",
    description: "A task management application with features like task creation, assignment, due dates, and status tracking. Includes user authentication and team collaboration.",
    technologies: ["React", "Firebase", "Material-UI", "Redux"],
    image: "/images/projects/task-management.jpg", // Placeholder path
    githubLink: "https://github.com/yourusername/task-management",
    liveLink: "https://task-management.example.com",
    featured: true
  }
];

export default projects;