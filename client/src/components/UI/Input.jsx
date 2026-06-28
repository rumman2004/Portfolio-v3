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
        <label htmlFor={inputId} className="block text-sm font-semibold text-gray-600 mb-2 ml-1 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`w-full bg-[#e6edf5] rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none transition-all duration-300 shadow-[inset_3px_3px_6px_#c8d0da,inset_-3px_-3px_6px_#ffffff] focus:shadow-[inset_4px_4px_8px_#c8d0da,inset_-4px_-4px_8px_#ffffff] ${error ? 'border border-red-500' : 'border-none'}`}
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
