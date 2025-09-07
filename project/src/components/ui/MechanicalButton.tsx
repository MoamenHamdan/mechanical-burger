import React from 'react';

interface MechanicalButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export const MechanicalButton: React.FC<MechanicalButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = ''
}) => {
  const baseClasses = 'relative overflow-hidden font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 shadow-lg';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-800 border-blue-400 text-white hover:from-blue-500 hover:to-blue-700 shadow-blue-500/30',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-800 border-gray-400 text-white hover:from-gray-500 hover:to-gray-700 shadow-gray-500/30',
    danger: 'bg-gradient-to-r from-red-600 to-red-800 border-red-400 text-white hover:from-red-500 hover:to-red-700 shadow-red-500/30'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed hover:scale-100 active:scale-100' 
    : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full transition-transform duration-1000 hover:translate-x-full"></div>
      {children}
    </button>
  );
};