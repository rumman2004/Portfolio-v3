import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false, 
  disabled = false,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 active:scale-95 focus:outline-none';
  
  const variants = {
    primary: 'bg-blue-500 text-white shadow-[4px_4px_10px_rgba(59,130,246,0.3)] hover:bg-blue-600',
    secondary: 'bg-[#e6edf5] text-gray-600 shadow-[4px_4px_8px_#c8d0da,-4px_-4px_8px_#ffffff] hover:text-blue-500 active:shadow-[inset_2px_2px_5px_#c8d0da,inset_-2px_-2px_5px_#ffffff]',
    danger: 'bg-[#e6edf5] text-red-500 shadow-[4px_4px_8px_#c8d0da,-4px_-4px_8px_#ffffff] hover:text-red-600 active:shadow-[inset_2px_2px_5px_#c8d0da,inset_-2px_-2px_5px_#ffffff]',
    ghost: 'bg-transparent text-gray-500 hover:text-gray-800 hover:bg-[#e6edf5] shadow-none',
  };

  const sizes = {
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-6 py-2.5',
    lg: 'text-lg px-8 py-3',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${(disabled || isLoading) ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
