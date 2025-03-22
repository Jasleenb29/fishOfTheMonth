
import React, { useEffect, useState } from 'react';

interface TransitionWrapperProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

const TransitionWrapper: React.FC<TransitionWrapperProps> = ({ 
  children, 
  delay = 0, 
  duration = 400,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all ${className}`}
      style={{ 
        opacity: isVisible ? 1 : 0, 
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        transitionDuration: `${duration}ms`
      }}
    >
      {children}
    </div>
  );
};

export default TransitionWrapper;
