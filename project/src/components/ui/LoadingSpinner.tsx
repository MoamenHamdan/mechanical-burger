import React from 'react';
import { GearAnimation } from './GearAnimation';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center items-center space-x-4 mb-6">
          <GearAnimation size="lg" speed="normal" className="text-blue-400" />
          <GearAnimation size="md" speed="fast" className="text-orange-500" />
          <GearAnimation size="lg" speed="slow" className="text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Mechanical Burger</h2>
        <p className="text-gray-400">{message}</p>
        <div className="mt-4 flex justify-center">
          <div className="w-8 h-1 bg-blue-500 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};