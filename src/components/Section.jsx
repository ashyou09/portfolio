import '../styles/Section.css';

/**
 * Section Component
 * 
 * A reusable section component that provides consistent styling and structure
 * for each major section of the portfolio.
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Section ID for navigation/linking
 * @param {string} props.title - Section title
 * @param {string} [props.subtitle] - Optional section subtitle
 * @param {React.ReactNode} props.children - Section content
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.backgroundColor] - Optional background color override
 * @param {boolean} [props.fullWidth=false] - Whether the section content should be full width
 * @returns {JSX.Element} The Section component
 */
function Section({
  id,
  title,
  subtitle,
  children,
  className = '',
  backgroundColor,
  fullWidth = false
}) {
  // Generate section style if backgroundColor is provided
  const sectionStyle = backgroundColor ? { backgroundColor } : {};
  
  return (
    <section id={id} className={`section ${className}`} style={sectionStyle}>
      <div className={`section-container ${fullWidth ? 'full-width' : ''}`}>
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
          <div className="section-divider"></div>
        </div>
        
        {/* Section Content */}
        <div className="section-content">
          {children}
        </div>
      </div>
    </section>
  );
}

export default Section;