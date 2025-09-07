import React from 'react';
import { GearAnimation } from './GearAnimation';

export const MechanicalBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated Mechanical Grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="mechanical-texture w-full h-full"></div>
      </div>

      {/* Floating Gears with Different Speeds */}
      <div className="absolute top-20 left-10 opacity-15">
        <GearAnimation size="lg" speed="slow" className="text-blue-500" />
      </div>
      <div className="absolute top-40 right-20 opacity-15">
        <GearAnimation size="md" speed="normal" className="text-orange-500" />
      </div>
      <div className="absolute bottom-20 left-1/4 opacity-15">
        <GearAnimation size="sm" speed="fast" className="text-red-500" />
      </div>
      <div className="absolute top-1/2 right-10 opacity-15">
        <GearAnimation size="md" speed="slow" className="text-purple-500" />
      </div>
      <div className="absolute bottom-40 right-1/3 opacity-15">
        <GearAnimation size="lg" speed="normal" className="text-green-500" />
      </div>
      <div className="absolute top-1/3 left-1/2 opacity-10">
        <GearAnimation size="md" speed="fast" className="text-yellow-500" />
      </div>

      {/* Car Engine Parts */}
      <div className="absolute top-32 left-1/3 opacity-10">
        <div className="w-8 h-16 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full piston-animation"></div>
      </div>
      <div className="absolute bottom-32 right-1/4 opacity-10">
        <div className="w-6 h-20 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full piston-animation" style={{ animationDelay: '1s' }}></div>
      </div>
      <div className="absolute top-1/4 right-1/2 opacity-10">
        <div className="w-4 h-12 bg-gradient-to-b from-orange-600 to-orange-800 rounded-full piston-animation" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Car Silhouettes */}
      <div className="absolute bottom-10 left-10 opacity-5">
        <svg width="120" height="60" viewBox="0 0 120 60" className="text-gray-600">
          <path d="M10 40 L20 30 L30 25 L90 25 L100 30 L110 40 L110 50 L10 50 Z" fill="currentColor"/>
          <circle cx="25" cy="45" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="95" cy="45" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </div>
      <div className="absolute top-20 right-20 opacity-5">
        <svg width="100" height="50" viewBox="0 0 100 50" className="text-gray-600 transform rotate-180">
          <path d="M5 35 L15 25 L25 20 L75 20 L85 25 L95 35 L95 45 L5 45 Z" fill="currentColor"/>
          <circle cx="20" cy="40" r="6" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="80" cy="40" r="6" fill="none" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </div>

      {/* Engine Block Animation */}
      <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 opacity-10">
        <div className="w-16 h-12 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg engine-pulse">
          <div className="w-full h-2 bg-blue-500 rounded-t-lg opacity-50"></div>
          <div className="flex justify-between px-2 py-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>

      {/* Circuit Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 1000 1000">
        <defs>
          <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
            <circle cx="10" cy="10" r="2" fill="currentColor"/>
            <circle cx="90" cy="90" r="2" fill="currentColor"/>
            <path d="M50,10 L50,50 L90,50" fill="none" stroke="currentColor" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)" className="text-blue-400"/>
      </svg>

      {/* Moving Mechanical Parts */}
      <div className="absolute top-1/2 left-20 opacity-10">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-8 bg-gradient-to-b from-gray-500 to-gray-700 rounded animate-bounce"></div>
          <div className="w-3 h-6 bg-gradient-to-b from-gray-500 to-gray-700 rounded animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-10 bg-gradient-to-b from-gray-500 to-gray-700 rounded animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/3 to-transparent animate-pulse"></div>
      
      {/* Mechanical Texture Overlay */}
      <div className="absolute inset-0 circuit-pattern opacity-5"></div>
    </div>
  );
};