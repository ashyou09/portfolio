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

import aiInterviewImg from '../assets/interview_agent.png';
import estateVerseImg from '../assets/estate_verse.png';
import sushiHeroImg from '../assets/sushi_hero.png';
import photoJsonImg from '../assets/photo_json.png';

const projects = [
  {
    id: "estateverse",
    title: "EstateVerse: AI-Powered Real Estate Price Persona Predictor",
    description: "Designed and developed a full-stack AI-powered real estate application. Integrated machine learning models with a web-based interface for real-time predictions. Enabled data-driven property pricing and targeted buyer identification.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Python", "FastAPI", "Scikit-learn"],
    image: estateVerseImg,
    githubLink: "https://github.com/ashyou09/EstateVerse",
    liveLink: "https://estateverse-demo.com",
    featured: true
  },
  {
    id: "sushi",
    title: "Japanese Sushi Website",
    description: "Designed and developed a visually appealing, sushi-themed website inspired by Japanese culture, optimized for both desktop and mobile experiences. Features responsive design, smooth scrolling, interactive menu, and fast load performance.",
    technologies: ["HTML", "CSS", "Vanilla JavaScript"],
    image: sushiHeroImg,
    githubLink: "https://github.com/ashyou09/sushi-website",
    liveLink: "https://sushi-website-demo.com",
    featured: true
  },
  {
    id: "interview-agent",
    title: "Interview Agent: AI-Powered Interview Preparation Tool",
    description: "Developed a smart interview preparation platform that dynamically generates questions using Gemini API, simulates mock interviews, and ensures user authentication and scalability via Firebase.",
    technologies: ["Next.js (React)", "Firebase (Firestore Auth)", "Gemini API", "Vercel"],
    image: aiInterviewImg,
    githubLink: "https://github.com/ashyou09/interview-agent",
    liveLink: "https://ai-interview-agent-1974.vercel.app",
    featured: true
  },
  {
    id: "photo-json",
    title: "Photo to Json convertor",
    description: "This app takes an image and extracts the image text and converts it into a JSON file.",
    technologies: ["HTML", "CSS", "React", "AI"],
    image: photoJsonImg,
    githubLink: "https://github.com/ashyou09/json.convertor",
    liveLink: "https://ashyou09.github.io/json.convertor/",
    featured: true
  }
];

export default projects;