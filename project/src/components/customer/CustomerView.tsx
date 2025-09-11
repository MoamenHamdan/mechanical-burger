import React, { useMemo, useState } from 'react';
import { Burger, Order, Category, CustomizationOption, OrderItem } from '../../types';
import { BurgerCard } from './BurgerCard';
import { CustomizationModal } from './CustomizationModal';
import { OrderConfirmation } from './OrderConfirmation';
import { MechanicalBackground } from '../ui/MechanicalBackground';
import { PistonAnimation } from '../ui/PistonAnimation';
import { GearNav } from './GearNav';
import { MechanicalCard } from '../ui/MechanicalCard';
import { MechanicalButton } from '../ui/MechanicalButton';
import { ordersService } from '../../services/firebaseService';

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
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orderComments, setOrderComments] = useState('');
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway'>('dine-in');
  const [phoneError, setPhoneError] = useState('');
  const [placing, setPlacing] = useState(false);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [cartItems]);

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
    setCartItems(prev => {
      // merge by burger id and same customization signature
      const signature = (i: OrderItem) => `${i.burger.id}|${i.customizations.map(c => c.id).sort().join(',')}`;
      const sig = signature(item);
      const existingIndex = prev.findIndex(ci => signature(ci) === sig);
      if (existingIndex !== -1) {
        const existing = prev[existingIndex];
        const updated: OrderItem = {
          ...existing,
          quantity: existing.quantity + item.quantity,
          totalPrice: existing.totalPrice + item.totalPrice
        };
        const copy = [...prev];
        copy[existingIndex] = updated;
        return copy;
      }
      return [...prev, item];
    });
  };

  // Lebanese phone number validation (same as modal)
  const validateLebanesePhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, '');
    const patterns = [
      /^03\d{6}$/,
      /^70\d{6}$/,
      /^71\d{6}$/,
      /^76\d{6}$/,
      /^78\d{6}$/,
      /^79\d{6}$/,
      /^81\d{6}$/,
      /^01\d{6}$/,
      /^04\d{6}$/,
      /^05\d{6}$/,
      /^06\d{6}$/,
      /^07\d{6}$/,
      /^08\d{6}$/,
      /^09\d{6}$/
    ];
    return patterns.some(pattern => pattern.test(cleanPhone));
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    if (value.trim() && !validateLebanesePhone(value)) {
      setPhoneError('Please enter a valid Lebanese phone number');
    } else {
      setPhoneError('');
    }
  };

  const handleNewOrder = () => {
    setShowConfirmation(false);
    setCurrentOrder(null);
  };

  const removeCartItem = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCartItems([]);

  const placeCartOrder = async (customerName: string, phoneNumber: string, comments: string, orderType: 'dine-in' | 'takeaway') => {
    const order: Order = {
      id: Date.now().toString(),
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),
      items: cartItems,
      totalAmount: cartTotal,
      timestamp: new Date(),
      status: 'pending',
      estimatedTime: Math.floor(Math.random() * 15) + 10,
      comments: comments.trim() || undefined,
      orderType
    };
    // Persist via confirmation modal of CustomizationModal currently; but here we manage cart checkout
    // We'll reuse OrderConfirmation after creation is acknowledged by parent via onOrderComplete
    onOrderComplete(order);
    setCurrentOrder(order);
    setShowConfirmation(true);
    clearCart();
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
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-orange-500 bg-clip-text text-transparent mb-2 sm:mb-4">
            FUEL YOUR ENGINE
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-4 sm:mb-6 px-2">
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

      {/* Cart Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-6 sm:pb-12 relative z-10">
        <MechanicalCard>
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Cart</h3>
              <span className="text-orange-400 font-extrabold text-xl">${cartTotal.toFixed(2)}</span>
            </div>
            {cartItems.length === 0 ? (
              <p className="text-gray-400">Your cart is empty.</p>
            ) : (
              <div className="space-y-3 mb-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-start justify-between bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <div>
                      <div className="text-white font-semibold">{item.quantity}x {item.burger.name}</div>
                      {item.customizations.length > 0 && (
                        <div className="text-sm text-blue-300 mt-1">
                          {item.customizations.map(c => c.name).join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-orange-400 font-bold">${item.totalPrice.toFixed(2)}</span>
                      <button onClick={() => removeCartItem(index)} className="text-gray-400 hover:text-red-400">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {cartItems.length > 0 && (
              <div className="mt-4 border-t border-gray-700 pt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">CUSTOMER NAME:</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">PHONE NUMBER:</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="03 XXX XXX"
                      className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:ring-2 transition-all ${
                        phoneError 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                      }`}
                    />
                    {phoneError && (
                      <p className="text-red-400 text-sm mt-1">{phoneError}</p>
                    )}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">ORDER TYPE:</label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setOrderType('dine-in')}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                          orderType === 'dine-in'
                            ? 'border-green-500 bg-green-500/20 text-green-300'
                            : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        🍽️ DINE IN
                      </button>
                      <button
                        onClick={() => setOrderType('takeaway')}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                          orderType === 'takeaway'
                            ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                            : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        🚚 TAKEAWAY
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">SPECIAL COMMENTS (Optional):</label>
                    <textarea
                      value={orderComments}
                      onChange={(e) => setOrderComments(e.target.value)}
                      placeholder="Any special requests or notes..."
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <MechanicalButton variant="secondary" onClick={clearCart}>
                    Clear Cart
                  </MechanicalButton>
                  <MechanicalButton
                    onClick={async () => {
                      if (!customerName.trim() || !phoneNumber.trim() || phoneError || placing) return;
                      setPlacing(true);
                      try {
                        const order: Order = {
                          id: Date.now().toString(),
                          customerName: customerName.trim(),
                          phoneNumber: phoneNumber.trim(),
                          items: cartItems,
                          totalAmount: cartTotal,
                          timestamp: new Date(),
                          status: 'pending',
                          estimatedTime: Math.floor(Math.random() * 15) + 10,
                          comments: orderComments.trim() || undefined,
                          orderType
                        };
                        await ordersService.create(order);
                        setCurrentOrder(order);
                        setShowConfirmation(true);
                        onOrderComplete(order);
                        clearCart();
                        setCustomerName('');
                        setPhoneNumber('');
                        setOrderComments('');
                      } catch (e) {
                        alert('Failed to place order. Please try again.');
                      } finally {
                        setPlacing(false);
                      }
                    }}
                    disabled={!customerName.trim() || !phoneNumber.trim() || !!phoneError || cartItems.length === 0 || placing}
                  >
                    {placing ? 'PLACING...' : 'PLACE ORDER'}
                  </MechanicalButton>
                </div>
              </div>
            )}
          </div>
        </MechanicalCard>
      </div>

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