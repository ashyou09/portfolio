import { useState } from 'react';
import Section from '../components/Section';
import skills from '../data/skills';
import '../styles/Skills.css';

/**
 * Skills Section Component
 * 
 * This component renders the Skills section of the portfolio, displaying
 * the developer's technical and soft skills organized by categories.
 * 
 * Features:
 * - Tab-based navigation between skill categories
 * - Visual skill level indicators
 * - Responsive grid layout
 * 
 * @returns {JSX.Element} The Skills section component
 */
function Skills() {
  // Get all skill categories from the skills data
  const categories = Object.keys(skills);
  
  // State for active category tab
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  
  /**
   * Handle tab click to change active category
   * @param {string} category - The category to activate
   */
  const handleTabClick = (category) => {
    setActiveCategory(category);
  };
  
  /**
   * Get skill level label based on numeric level
   * @param {number} level - Skill level (1-5)
   * @returns {string} Skill level label
   */
  const getSkillLevelLabel = (level) => {
    switch (level) {
      case 1: return 'Beginner';
      case 2: return 'Basic';
      case 3: return 'Intermediate';
      case 4: return 'Advanced';
      case 5: return 'Expert';
      default: return 'Intermediate';
    }
  };
  
  return (
    <Section
      id="skills"
      title="My Skills"
      subtitle="A comprehensive overview of my technical expertise and proficiencies"
    >
      <div className="skills-container">
        {/* Category Tabs */}
        <div className="skills-tabs">
          {categories.map((category) => (
            <button
              key={category}
              className={`skills-tab ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleTabClick(category)}
            >
              {/* Capitalize first letter of category */}
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Skills Grid */}
        <div className="skills-grid">
          {skills[activeCategory].map((skill, index) => (
            <div key={index} className="skill-card">
              {/* Skill Icon (placeholder) */}
              <div className="skill-icon">
                {/* Replace with actual icons in production */}
                <span className="skill-icon-placeholder">{skill.icon?.charAt(0) || skill.name.charAt(0)}</span>
              </div>
              
              {/* Skill Details */}
              <div className="skill-details">
                <h4 className="skill-name">{skill.name}</h4>
                
                {/* Skill Level Bar */}
                <div className="skill-level-container">
                  <div className="skill-level-bar">
                    <div 
                      className="skill-level-fill"
                      style={{ width: `${(skill.level / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="skill-level-label">{getSkillLevelLabel(skill.level)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export default Skills;