import { useState, useRef } from 'react';
import '../styles/TiltCard.css';

/**
 * TiltCard Component
 * 
 * A container component that applies a 3D tilt effect to its children on hover.
 * Uses mouse position to calculate rotation transforms.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to be tilted
 * @param {number} props.max - Maximum tilt angle in degrees (default: 15)
 * @param {number} props.perspective - 3D perspective depth (default: 1000)
 * @param {number} props.scale - Scale factor on hover (default: 1.05)
 */
const TiltCard = ({ children, max = 15, perspective = 1000, scale = 1.05, className = '' }) => {
    const [style, setStyle] = useState({});
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const card = cardRef.current;
        const { left, top, width, height } = card.getBoundingClientRect();

        // Calculate mouse position relative to card center
        const x = e.clientX - left - width / 2;
        const y = e.clientY - top - height / 2;

        // Calculate rotation values
        // RotateX is based on Y axis movement (up/down tilts x-axis)
        // RotateY is based on X axis movement (left/right tilts y-axis)
        // We invert X rotation so moving mouse up tilts top away
        const rotateX = (y / (height / 2)) * -max;
        const rotateY = (x / (width / 2)) * max;

        setStyle({
            transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
            transition: 'none', // Remove transition during movement for smoothness
        });
    };

    const handleMouseLeave = () => {
        setStyle({
            transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
            transition: 'transform 0.5s ease-out', // Smooth return to center
        });
    };

    return (
        <div
            className={`tilt-card ${className}`}
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={style}
        >
            <div className="tilt-card-inner">
                {children}
            </div>
            {/* Glare effect overlay */}
            <div className="tilt-card-glare" />
        </div>
    );
};

export default TiltCard;
