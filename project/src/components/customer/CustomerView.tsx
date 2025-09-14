import React, { useState } from 'react';
import { Burger, Order, Category, CustomizationOption, OrderItem } from '../../types';
import { BurgerCard } from './BurgerCard';
import { CustomizationModal } from './CustomizationModal';
import { OrderConfirmation } from './OrderConfirmation';
import { CartPage } from './CartPage';
import { MechanicalBackground } from '../ui/MechanicalBackground';
import { PistonAnimation } from '../ui/PistonAnimation';
import { GearNav } from './GearNav';
import logo from '../../images /logo.png';

interface CustomerViewProps {
  burgers: Burger[];
  categories: Category[];
  customizations: CustomizationOption[];
  onOrderComplete: (order: Order) => void;
  cartItems: OrderItem[];
  onUpdateCart: (items: OrderItem[]) => void;
  showCart: boolean;
  onCartToggle: () => void;
}

export const CustomerView: React.FC<CustomerViewProps> = ({ 
  burgers, 
  categories, 
  customizations, 
  onOrderComplete,
  cartItems,
  onUpdateCart,
  showCart,
  onCartToggle
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

  const handleAddToCart = (item: OrderItem) => {
    const signature = (i: OrderItem) => `${i.burger.id}|${i.customizations.map(c => c.id).sort().join(',')}`;
    const sig = signature(item);
    const existingIndex = cartItems.findIndex(ci => signature(ci) === sig);
    if (existingIndex !== -1) {
      const existing = cartItems[existingIndex];
      const updated: OrderItem = {
        ...existing,
        quantity: existing.quantity + item.quantity,
        totalPrice: existing.totalPrice + item.totalPrice
      };
      const copy = [...cartItems];
      copy[existingIndex] = updated;
      onUpdateCart(copy);
    } else {
      onUpdateCart([...cartItems, item]);
    }
  };

  if (showCart) {
    return (
      <CartPage
        items={cartItems}
        onBack={onCartToggle}
        onUpdateCart={onUpdateCart}
        onOrderComplete={(order) => {
          setCurrentOrder(order);
          setShowConfirmation(true);
          onOrderComplete(order);
          onCartToggle();
        }}
      />
    );
  }
  const handleNewOrder = () => {
    setShowConfirmation(false);
    setCurrentOrder(null);
  };

  if (showConfirmation && currentOrder) {
    return (
      <OrderConfirmation 
        order={currentOrder} 
        onNewOrder={handleNewOrder}
        onEditOrder={() => {
          setShowConfirmation(false);
          setSelectedBurger(currentOrder.items[0].burger);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">
      <MechanicalBackground />
      
      {/* Hero Section */}
      <div className="relative py-4 sm:py-6 px-3 sm:px-4 text-center z-10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-5 left-5 sm:top-10 sm:left-10">
            <PistonAnimation className="text-blue-500/30" />
          </div>
          <div className="absolute top-20 right-10 sm:top-40 sm:right-20">
            <PistonAnimation direction="horizontal" className="text-orange-500/30" />
          </div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <img src={logo} alt="Logo" className="h-14 w-14 sm:h-20 sm:w-20 rounded-md border border-orange-500 mb-3" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold text-orange-400 mb-2 sm:mb-4">
            FUEL YOUR ENGINE
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-orange-300 mb-4 sm:mb-6 px-2">
            Precision-engineered burgers for the modern mechanic
          </p>
        </div>
      </div>

      {/* Gear Category Navigation */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 mb-4 sm:mb-6 relative z-10">
        <GearNav
          categories={categories}
          activeCategoryId={filter}
          onSelect={(id) => setFilter(id)}
        />
      </div>

      {/* Items Grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-6 sm:pb-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredBurgers.map((burger) => (
            <BurgerCard 
              key={burger.id} 
              burger={burger}
              category={categories.find(c => c.id === burger.categoryId)}
              onCustomize={handleCustomize}
            />
          ))}
        </div>
      </div>

      {/* Cart moved to dedicated CartPage via header button */}

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 border-t border-gray-700 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-300 text-sm">
            © 2024{' '}
            <a 
              href="https://moamenhamdanportfolio.web.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 transition-colors font-semibold"
            >
              Moamen Hamdan
            </a>
            . All rights reserved. Built with precision engineering.
          </p>
        </div>
      </footer>

      {/* Customization Modal */}
      {selectedBurger && (
        <CustomizationModal
          burger={selectedBurger}
          customizations={customizations}
          onClose={() => setSelectedBurger(null)}
          onOrderComplete={handleOrderComplete}
          mode="addToCart"
          onAddToCart={handleAddToCart}
          disableCustomizations={(() => {
            const cat = categories.find(c => c.id === selectedBurger.categoryId)?.name.toLowerCase();
            return !!cat && (cat.includes('drink') || cat.includes('fries') || cat.includes('shesha') || cat.includes('sheesha') || cat.includes('shisha'));
          })()}
        />
      )}
    </div>
  );
};