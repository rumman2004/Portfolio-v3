import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  glass = true,
  ...props 
}) => {
  const glassStyles = glass ? 'bg-white/80 backdrop-blur-md border border-gray-100' : 'bg-white border border-gray-200';
  const hoverStyles = hover ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-gray-300' : '';

  return (
    <div 
      className={`rounded-2xl shadow-xl overflow-hidden ${glassStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
