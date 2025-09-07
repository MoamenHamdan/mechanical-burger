import React from 'react';

interface MechanicalCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const MechanicalCard: React.FC<MechanicalCardProps> = ({ 
  children, 
  className = '',
  hover = true 
}) => {
  return (
    <div className={`
      relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
      border border-gray-600 rounded-lg shadow-2xl
      ${hover ? 'hover:shadow-blue-500/20 hover:border-blue-500/50 hover:scale-105' : ''}
      transition-all duration-300 transform
      before:absolute before:inset-0 before:rounded-lg before:border before:border-gray-500/20
      ${className}
    `}>
      <div className="relative z-10">
        {children}
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-orange-500/5 rounded-lg"></div>
    </div>
  );
};