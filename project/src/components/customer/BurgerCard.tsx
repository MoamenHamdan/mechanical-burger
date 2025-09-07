import React from 'react';
import { Plus, Wrench } from 'lucide-react';
import { Burger, Category } from '../../types';
import { MechanicalCard } from '../ui/MechanicalCard';
import { MechanicalButton } from '../ui/MechanicalButton';

interface BurgerCardProps {
  burger: Burger;
  category?: Category;
  onCustomize: (burger: Burger) => void;
}

export const BurgerCard: React.FC<BurgerCardProps> = ({ burger, category, onCustomize }) => {
  return (
    <MechanicalCard className="overflow-hidden group">
      <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
        <img 
          src={burger.image} 
          alt={burger.name}
          className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            'bg-blue-600 text-white'
          }`}>
            {category?.name.toUpperCase() || 'BURGER'}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
            {burger.name}
          </h3>
          <span className="text-2xl font-bold text-orange-400">
            ${burger.price.toFixed(2)}
          </span>
        </div>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-2">COMPONENTS:</h4>
            <div className="flex flex-wrap gap-2">
              {burger.ingredients.map((ingredient, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-md border border-gray-600"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
          
          <MechanicalButton 
            onClick={() => onCustomize(burger)}
            className="w-full flex items-center justify-center space-x-2"
          >
            <Wrench size={18} />
            <span>Customize & Order</span>
            <Plus size={18} />
          </MechanicalButton>
        </div>
      </div>
    </MechanicalCard>
  );
};