import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  type = 'text', 
  className = '', 
  id,
  ...props 
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-md-on-surface-variant mb-2 ml-1 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`w-full bg-md-surface rounded-3xl px-4 py-3 text-md-on-surface placeholder-gray-400 focus:outline-none transition-all duration-300 border border-md-outline-variant focus:border-md-primary focus:ring-1 focus:ring-md-primary focus:border border-md-outline-variant focus:border-md-primary focus:ring-1 focus:ring-md-primary ${error ? 'border border-red-500' : 'border-none'}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500 ml-1 flex items-center gap-1 font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

