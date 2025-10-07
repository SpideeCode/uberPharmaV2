import React from 'react';
import { cn } from '../../lib/utils';

const AppContent = ({ 
  children, 
  className,
  variant = 'default',
  ...props 
}) => {
  return (
    <main 
      className={cn(
        'flex-1',
        variant === 'sidebar' && 'md:pl-[280px]',
        className
      )}
      {...props}
    >
      <div className="h-full w-full">
        {children}
      </div>
    </main>
  );
};

export { AppContent };
