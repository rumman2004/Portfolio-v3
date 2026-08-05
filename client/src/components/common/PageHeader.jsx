import React from 'react';

const PageHeader = ({ title, description, actions }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-md-surface-variant">
      <div>
        <h1 className="text-3xl sm:text-4xl font-headline text-md-on-surface tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-md-on-surface-variant max-w-2xl text-sm sm:text-base font-medium">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
