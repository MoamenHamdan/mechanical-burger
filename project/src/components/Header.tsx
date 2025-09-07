import React from 'react';
import { User } from 'lucide-react';
import { ViewMode } from '../types';
import { GearAnimation } from './ui/GearAnimation';
import { useLanguage } from '../hooks/useLanguage';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const { isRTL } = useLanguage();
  

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
            <div className="relative">
              <GearAnimation size="lg" speed="slow" className="text-blue-400" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-orange-500 bg-clip-text text-transparent">
                Mechanical Burger
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <button
              onClick={() => onViewChange('customer')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                currentView === 'customer'
                  ? 'bg-blue-600 text-white shadow-blue-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <User size={20} />
              <span>Menu</span>
            </button>
          </nav>
        </div>
      </div>
      
      {/* Admin access is hidden; use secret URL to access */}
    </header>
  );
};