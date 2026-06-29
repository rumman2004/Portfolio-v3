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
      text-white
      bg-gradient-to-br from-indigo-500 via-indigo-400 to-indigo-300
      border-white/30
      shadow-[0_4px_15px_rgba(99,102,241,0.35),0_1px_0_rgba(255,255,255,0.25)_inset]
      hover:shadow-[0_8px_25px_rgba(99,102,241,0.45),0_1px_0_rgba(255,255,255,0.3)_inset]
      hover:-translate-y-px
    `,
    secondary: `
      text-indigo-600
      bg-white/30 backdrop-blur-md
      border-white/60
      shadow-[0_4px_16px_rgba(99,102,241,0.08),0_1px_0_rgba(255,255,255,0.7)_inset]
      hover:bg-white/50 hover:text-indigo-700
    `,
    danger: `
      text-red-500
      bg-white/30 backdrop-blur-md
      border-white/60
      shadow-[0_4px_16px_rgba(239,68,68,0.08),0_1px_0_rgba(255,255,255,0.7)_inset]
      hover:bg-red-50/60 hover:text-red-600
    `,
    ghost: `
      text-gray-500 bg-transparent border-transparent
      hover:bg-white/40 hover:text-gray-800
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