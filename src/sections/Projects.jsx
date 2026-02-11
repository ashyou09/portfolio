import { useState } from 'react';
import Section from '../components/Section';
import Button from '../components/Button';
import TiltCard from '../components/TiltCard';
import projects from '../data/projects';
import '../styles/Projects.css';

/**
 * Projects Section Component
 * 
 * This component renders the Projects section of the portfolio, showcasing
 * the developer's work with details, technologies used, and links.
 * 
 * Features:
 * - Featured projects highlighted
 * - Filter options for project types
 * - Project cards with details and links
 * - Responsive grid layout
 * 
 * @returns {JSX.Element} The Projects section component
 */
function Projects() {
  // State for active filter
  const [activeFilter, setActiveFilter] = useState('all');

  /**
   * Filter projects based on active filter
   * @returns {Array} Filtered projects array
   */
  const getFilteredProjects = () => {
    if (activeFilter === 'featured') {
      return projects.filter(project => project.featured);
    }
    return projects;
  };

  /**
   * Handle filter button click
   * @param {string} filter - The filter to apply
   */
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  // Get filtered projects
  const filteredProjects = getFilteredProjects();

  return (
    <Section
      id="projects"
      title="My Projects"
      subtitle="A selection of my recent work and personal projects"
    >
      <div className="projects-container">
        {/* Filter Buttons */}
        <div className="projects-filters">
          <button
            className={`project-filter ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterClick('all')}
          >
            All Projects
          </button>
          <button
            className={`project-filter ${activeFilter === 'featured' ? 'active' : ''}`}
            onClick={() => handleFilterClick('featured')}
          >
            Featured
          </button>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <TiltCard key={project.id} className="project-card-wrapper">
              <div className="project-card">
                {/* Project Image */}
                <div className="project-image-container">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="project-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/600x400?text=Project+Image';
                    }}
                  />

                  {/* Project Links Overlay */}
                  <div className="project-links">
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link github"
                        aria-label="View GitHub Repository"
                      >
                        GitHub
                      </a>
                    )}
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link live"
                        aria-label="View Live Demo"
                      >
                        Live Demo
                      </a>
                    )}
                  </div>

                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="project-featured-badge">Featured</div>
                  )}
                </div>

                {/* Project Details */}
                <div className="project-details">
                  <h3 className="project-title">{project.title}</h3>

                  {/* Project Technologies */}
                  <div className="project-technologies">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="project-technology">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Project Description */}
                  <p className="project-description">{project.description}</p>

                  {/* Project Actions */}
                  <div className="project-actions">
                    {project.githubLink && (
                      <Button
                        href={project.githubLink}
                        type="outline"
                        size="small"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Code
                      </Button>
                    )}
                    {project.liveLink && (
                      <Button
                        href={project.liveLink}
                        type="primary"
                        size="small"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Live Demo
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* No Projects Message */}
        {filteredProjects.length === 0 && (
          <div className="no-projects">
            <p>No projects found matching the selected filter.</p>
          </div>
        )}
      </div>
    </Section>
  );
}

export default Projects;