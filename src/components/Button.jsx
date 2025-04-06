import '../styles/Button.css';

/**
 * Button Component
 * 
 * A reusable button component with various styles and options.
 * 
 * @param {Object} props - Component props
 * @param {string} props.children - Button text or content
 * @param {string} [props.type='primary'] - Button type/style ('primary', 'secondary', 'outline', 'text')
 * @param {string} [props.size='medium'] - Button size ('small', 'medium', 'large')
 * @param {string} [props.href] - If provided, renders as an anchor tag
 * @param {boolean} [props.fullWidth=false] - Whether the button should take full width
 * @param {Function} [props.onClick] - Click handler function
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {Object} [props.rest] - Additional props to pass to the button element
 * @returns {JSX.Element} The Button component
 */
function Button({
  children,
  type = 'primary',
  size = 'medium',
  href,
  fullWidth = false,
  onClick,
  className = '',
  disabled = false,
  ...rest
}) {
  // Combine CSS classes
  const buttonClasses = `
    button 
    button-${type} 
    button-${size}
    ${fullWidth ? 'button-full-width' : ''}
    ${className}
  `.trim();
  
  /**
   * Handle button click event
   * @param {Event} e - Click event
   */
  const handleClick = (e) => {
    // If disabled, prevent default action and don't call onClick
    if (disabled) {
      e.preventDefault();
      return;
    }
    
    // Call onClick handler if provided
    if (onClick) {
      onClick(e);
    }
  };
  
  // If href is provided, render as an anchor tag
  if (href) {
    return (
      <a
        href={disabled ? undefined : href}
        className={`${buttonClasses} ${disabled ? 'button-disabled' : ''}`}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </a>
    );
  }
  
  // Otherwise, render as a button element
  return (
    <button
      className={`${buttonClasses} ${disabled ? 'button-disabled' : ''}`}
      onClick={handleClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;