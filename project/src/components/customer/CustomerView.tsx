import React, { useState } from 'react';
import { Burger, Order, Category, CustomizationOption } from '../../types';
import { BurgerCard } from './BurgerCard';
import { CustomizationModal } from './CustomizationModal';
import { OrderConfirmation } from './OrderConfirmation';
import { MechanicalBackground } from '../ui/MechanicalBackground';
import { PistonAnimation } from '../ui/PistonAnimation';

interface CustomerViewProps {
  burgers: Burger[];
  categories: Category[];
  customizations: CustomizationOption[];
  onOrderComplete: (order: Order) => void;
}

export const CustomerView: React.FC<CustomerViewProps> = ({ 
  burgers, 
  categories, 
  customizations, 
  onOrderComplete 
}) => {
  const [selectedBurger, setSelectedBurger] = useState<Burger | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredBurgers = filter === 'all'
    ? burgers 
    : burgers.filter(burger => burger.categoryId === filter);

  const handleCustomize = (burger: Burger) => {
    setSelectedBurger(burger);
  };

  const handleOrderComplete = (order: Order) => {
    setSelectedBurger(null);
    setCurrentOrder(order);
    setShowConfirmation(true);
    onOrderComplete(order);
  };

  const handleNewOrder = () => {
    setShowConfirmation(false);
    setCurrentOrder(null);
  };

  if (showConfirmation && currentOrder) {
    return <OrderConfirmation order={currentOrder} onNewOrder={handleNewOrder} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">
      <MechanicalBackground />
      
      {/* Hero Section */}
      <div className="relative py-20 px-4 text-center z-10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10">
            <PistonAnimation className="text-blue-500/30" />
          </div>
          <div className="absolute top-40 right-20">
            <PistonAnimation direction="horizontal" className="text-orange-500/30" />
          </div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-orange-500 bg-clip-text text-transparent mb-6">
            FUEL YOUR ENGINE
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Precision-engineered burgers for the modern mechanic
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="max-w-7xl mx-auto px-4 mb-12 relative z-10">
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            key="all"
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
              filter === 'all'
                ? 'bg-blue-600 text-white border border-blue-400 shadow-lg shadow-blue-500/30'
                : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600 hover:text-white'
            }`}
          >
            ALL MODELS
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                filter === category.id
                  ? 'bg-blue-600 text-white border border-blue-400 shadow-lg shadow-blue-500/30'
                  : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600 hover:text-white'
              }`}
            >
              {category.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Burger Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBurgers.map((burger) => (
            <BurgerCard 
              key={burger.id} 
              burger={burger} 
              onCustomize={handleCustomize}
            />
          ))}
        </div>
      </div>

      {/* Customization Modal */}
      {selectedBurger && (
        <CustomizationModal
          burger={selectedBurger}
          categories={categories}
          customizations={customizations}
          onClose={() => setSelectedBurger(null)}
          onOrderComplete={handleOrderComplete}
        />
      )}
    </div>
  );
};