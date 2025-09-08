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
      <button
        key={id}
        onClick={() => handleClick(id)}
        onMouseEnter={playHover}
        className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border transition-all duration-300 flex items-center justify-center select-none
          ${isActive ? 'border-orange-500 bg-gray-800 shadow-[0_0_20px_rgba(234,88,12,0.35)]' : 'border-gray-700 bg-gray-900 hover:bg-gray-800'}
        `}
        aria-pressed={isActive}
      >
        <Settings
          className={`absolute ${isActive ? 'text-orange-400' : 'text-gray-400'} drop-shadow-[0_0_6px_rgba(255,255,255,0.25)] ${isSpinning ? 'animate-spin' : ''}`}
          size={48}
          strokeWidth={1.5}
        />
        <span className={`relative z-10 text-xs sm:text-sm font-extrabold tracking-widest ${isActive ? 'text-orange-300' : 'text-gray-100'} drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]`}>
          {label.toUpperCase()}
        </span>
      </button>
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


