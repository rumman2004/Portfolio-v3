import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  glass = true,
  ...props 
}) => {
  const glassStyles = glass ? 'bg-md-surface-container/80 backdrop-blur-md border border-md-surface-variant' : 'bg-md-surface border border-md-surface-variant';
  const hoverStyles = hover ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-md-outline-variant' : '';

  return (
    <div 
      className={`rounded-2xl shadow-sm overflow-hidden ${glassStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

