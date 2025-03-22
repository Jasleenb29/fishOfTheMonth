
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 'flat' | 'low' | 'medium' | 'high';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  width?: 'auto' | 'full';
  glassmorphism?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    children, 
    className, 
    elevation = 'medium', 
    padding = 'md',
    width = 'auto',
    glassmorphism = false,
    ...props 
  }, ref) => {
    const elevations = {
      flat: 'border',
      low: 'border shadow-sm',
      medium: 'border shadow-md',
      high: 'border shadow-lg',
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const widths = {
      auto: '',
      full: 'w-full',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl bg-card text-card-foreground',
          elevations[elevation],
          paddings[padding],
          widths[width],
          glassmorphism && 'glass-effect',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
