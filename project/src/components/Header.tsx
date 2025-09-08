import React from 'react';
import { User, Home, Settings, Phone, MapPin } from 'lucide-react';
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
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo Section */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2 sm:space-x-3' : 'space-x-2 sm:space-x-3'}`}>
            <div className="relative">
              <GearAnimation size="sm" speed="slow" className="text-blue-400" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-orange-500 bg-clip-text text-transparent">
                Mechanical Burger
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => onViewChange('customer')}
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm ${
                currentView === 'customer'
                  ? 'bg-blue-600 text-white shadow-blue-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Home size={14} />
              <span className="hidden sm:inline">Home</span>
            </button>
            
            <a href="#menu" className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm text-gray-300 hover:text-white hover:bg-gray-700">
              <User size={14} />
              <span className="hidden sm:inline">Menu</span>
            </a>
            
            <a href="#contact" className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm text-gray-300 hover:text-white hover:bg-gray-700">
              <Phone size={14} />
              <span className="hidden sm:inline">Contact</span>
            </a>
            
            <a href="#location" className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm text-gray-300 hover:text-white hover:bg-gray-700">
              <MapPin size={14} />
              <span className="hidden sm:inline">Location</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};