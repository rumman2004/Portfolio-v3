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
  const base = `
    inline-flex items-center justify-center font-bold rounded-full
    transition-all duration-300 active:scale-95 focus:outline-none
    border select-none
  `;

  const variants = {
    primary: `
      text-md-on-primary
      bg-md-primary
      border-transparent
      shadow-md
      hover:shadow-lg
      hover:-translate-y-px
    `,
    secondary: `
      text-md-on-secondary-container
      bg-md-secondary-container
      border-transparent
      hover:bg-md-surface-variant
    `,
    danger: `
      text-md-on-error-container
      bg-md-error-container
      border-transparent
      hover:bg-md-error
      hover:text-md-on-error
    `,
    ghost: `
      text-md-on-surface-variant bg-transparent border-transparent
      hover:bg-white/40 hover:text-md-on-surface
    `,
  };

  const sizes = {
    sm:  'text-xs px-4 py-2 tracking-wide',
    md:  'text-sm px-6 py-2.5 tracking-wide',
    lg:  'text-base px-8 py-3 tracking-wide',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        disabled || isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button; 
