import React from 'react';
import { cn } from '../../lib/utils';

const AppShell = ({ 
  children, 
  className,
  variant = 'default',
  ...props 
}) => {
  return (
    <div 
      className={cn(
        'flex min-h-screen w-full',
        variant === 'sidebar' && 'flex-col md:flex-row',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { AppShell };
