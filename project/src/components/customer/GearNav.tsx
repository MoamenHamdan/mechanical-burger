import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Category } from '../../types';
import { useSfx } from '../../hooks/useSfx';

interface GearNavProps {
  categories: Category[];
  activeCategoryId: string;
  onSelect: (categoryId: string) => void;
}

export const GearNav: React.FC<GearNavProps> = ({ categories, activeCategoryId, onSelect }) => {
  const [spinningId, setSpinningId] = useState<string | null>(null);
  const { playHover, playClick } = useSfx();

  const handleClick = (id: string) => {
    setSpinningId(id);
    onSelect(id);
    playClick();
    setTimeout(() => setSpinningId(null), 600);
  };

  const renderGear = (id: string, label: string) => {
    const isActive = activeCategoryId === id;
    const isSpinning = spinningId === id;
    return (
      <div key={id} className="flex flex-col items-center group">
        <button
          onClick={() => handleClick(id)}
          onMouseEnter={playHover}
          className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-2 transition-all duration-300 flex items-center justify-center select-none group-hover:scale-105
            ${isActive 
              ? 'border-orange-500 bg-gradient-to-br from-orange-500/20 to-orange-600/30 shadow-[0_0_25px_rgba(234,88,12,0.5)] ring-2 ring-orange-500/30' 
              : 'border-gray-600 bg-gradient-to-br from-gray-800 to-gray-900 hover:border-gray-500 hover:bg-gradient-to-br hover:from-gray-700 hover:to-gray-800'
            }
          `}
          aria-pressed={isActive}
        >
          <Settings
            className={`absolute ${isActive ? 'text-orange-400' : 'text-gray-400'} drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] ${isSpinning ? 'animate-spin' : ''} group-hover:text-orange-300 transition-colors`}
            size={52}
            strokeWidth={1.5}
          />
          <span className={`relative z-10 text-xs sm:text-sm font-black tracking-wider ${isActive ? 'text-orange-200' : 'text-gray-200'} drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] group-hover:text-orange-300 transition-colors`}>
            {label.toUpperCase()}
          </span>
        </button>
        {/* Enhanced label below the gear */}
        <div className={`mt-2 px-3 py-1 rounded-full border transition-all duration-300 ${
          isActive 
            ? 'bg-orange-500/20 border-orange-500/50 text-orange-300' 
            : 'bg-gray-800/50 border-gray-600/50 text-gray-400 group-hover:bg-gray-700/50 group-hover:border-gray-500/50 group-hover:text-gray-300'
        }`}>
          <span className="text-xs font-bold tracking-wide">
            {label.toUpperCase()}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 py-3 sm:py-4 md:py-6">
      {renderGear('all', 'All')}
      {categories.map((c) => renderGear(c.id, c.name))}
    </div>
  );
};

export default GearNav;


