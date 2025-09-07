import React from 'react';

interface PistonAnimationProps {
  className?: string;
  direction?: 'vertical' | 'horizontal';
}

export const PistonAnimation: React.FC<PistonAnimationProps> = ({ 
  className = '', 
  direction = 'vertical' 
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className={`bg-gradient-to-${direction === 'vertical' ? 'b' : 'r'} from-gray-600 to-gray-800 ${
        direction === 'vertical' ? 'w-4 h-16' : 'w-16 h-4'
      } rounded-full relative overflow-hidden`}>
        <div className={`absolute bg-gradient-to-${direction === 'vertical' ? 'b' : 'r'} from-blue-400 to-blue-600 ${
          direction === 'vertical' ? 'w-full h-6 animate-bounce' : 'w-6 h-full animate-pulse'
        } rounded-full`}></div>
      </div>
      <div className={`absolute ${direction === 'vertical' ? 'top-0 left-1/2 transform -translate-x-1/2 w-6 h-2' : 'left-0 top-1/2 transform -translate-y-1/2 w-2 h-6'} bg-gray-700 rounded`}></div>
    </div>
  );
};