import React from 'react';
import { Plus, Wrench, Gauge, Fuel } from 'lucide-react';
import { Burger, Category } from '../../types';
import { MechanicalCard } from '../ui/MechanicalCard';
import { MechanicalButton } from '../ui/MechanicalButton';
import { useSfx } from '../../hooks/useSfx';

interface BurgerCardProps {
  burger: Burger;
  category?: Category;
  onCustomize: (burger: Burger) => void;
}

export const BurgerCard: React.FC<BurgerCardProps> = ({ burger, category, onCustomize }) => {
  const { playHover, playClick } = useSfx();
  return (
    <MechanicalCard className="overflow-hidden group bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700 hover:border-orange-500/50 hover:shadow-[0_0_24px_rgba(234,88,12,0.25)] transition-all">
      <div className="aspect-w-16 aspect-h-9 relative overflow-hidden" onMouseEnter={playHover}>
        <img 
          src={burger.image} 
          alt={burger.name}
          className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/85 via-transparent to-transparent"></div>
        {/* Subtle blueprint glow and vignette inside image only */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12),transparent_60%)]"></div>
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.0)_40%,rgba(0,0,0,0.35))]"></div>

        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 rounded text-xs font-extrabold tracking-widest bg-black/60 border border-orange-500 text-orange-300 drop-shadow-[0_0_8px_rgba(234,88,12,0.6)]">
            {category?.name.toUpperCase() || 'BURGER'}
          </span>
        </div>
      </div>
      
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-wide group-hover:text-blue-400 transition-colors">
            {burger.name}
          </h3>
          <span className="text-lg sm:text-xl md:text-2xl font-bold text-orange-400">
            ${burger.price.toFixed(2)}
          </span>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          {/* Gauges Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2">
              <Gauge size={16} className="text-red-400" />
              <span className="text-xs sm:text-sm text-gray-300">Spice</span>
              <div className="w-16 sm:w-20 md:w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${Math.min(90, 20 + (burger.ingredients.length * 10))}%` }}></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Fuel size={16} className="text-green-400" />
              <span className="text-xs sm:text-sm text-gray-300">Fuel</span>
              <div className="w-16 sm:w-20 md:w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${Math.min(100, 40 + burger.price)}%` }}></div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-2">COMPONENTS:</h4>
            <div className="flex flex-wrap gap-2">
              {burger.ingredients.map((ingredient, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-800 text-gray-200 text-xs rounded-md border border-gray-600 hover:border-orange-500/60 transition-colors"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
          

          <MechanicalButton 
            onClick={() => { playClick(); onCustomize(burger); }}
            className="w-full flex items-center justify-center space-x-2"
          >
            <Wrench size={18} />
            <span>Customize</span>
            <Plus size={18} />
          </MechanicalButton>
        </div>
      </div>
    </MechanicalCard>
  );
};