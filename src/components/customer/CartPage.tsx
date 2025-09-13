import React, { useState } from 'react';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { OrderItem, Order } from '../../types';
import { MechanicalCard } from '../ui/MechanicalCard';
import { MechanicalButton } from '../ui/MechanicalButton';
import { ordersService } from '../../services/firebaseService';

interface CartPageProps {
  items: OrderItem[];
  onBack: () => void;
  onUpdateCart: (items: OrderItem[]) => void;
  onOrderComplete: (order: Order) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  items,
  onBack,
  onUpdateCart,
  onOrderComplete
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orderComments, setOrderComments] = useState('');
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway'>('dine-in');
  const [phoneError, setPhoneError] = useState('');
  const [placing, setPlacing] = useState(false);

  const cartTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  // Lebanese phone number validation
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

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(index);
      return;
    }

    const updatedItems = items.map((item, i) => {
      if (i === index) {
        const unitPrice = item.totalPrice / item.quantity;
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: unitPrice * newQuantity
        };
      }
      return item;
    });
    onUpdateCart(updatedItems);
  };

  const removeItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    onUpdateCart(updatedItems);
  };

  const clearCart = () => {
    onUpdateCart([]);
  };

  const placeOrder = async () => {
    if (!customerName.trim() || !phoneNumber.trim() || phoneError || placing) return;
    
    setPlacing(true);
    try {
      const order: Order = {
        id: Date.now().toString(),
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        items: items,
        totalAmount: cartTotal,
        timestamp: new Date(),
        status: 'pending',
        estimatedTime: Math.floor(Math.random() * 15) + 10,
        comments: orderComments.trim() || undefined,
        orderType
      };

      await ordersService.create(order);
      onOrderComplete(order);
      onUpdateCart([]);
      setCustomerName('');
      setPhoneNumber('');
      setOrderComments('');
    } catch (e) {
      alert('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Menu</span>
          </button>
          <h1 className="text-3xl font-bold text-orange-400 flex items-center gap-3">
            <ShoppingCart size={32} />
            Your Cart
          </h1>
        </div>

        {items.length === 0 ? (
          <MechanicalCard>
            <div className="p-12 text-center">
              <ShoppingCart size={64} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-400 mb-2">Your Cart is Empty</h3>
              <p className="text-gray-500 mb-6">Add some delicious burgers to get started!</p>
              <MechanicalButton onClick={onBack}>
                Browse Menu
              </MechanicalButton>
            </div>
          </MechanicalCard>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <MechanicalCard>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Order Items</h2>
                    <MechanicalButton onClick={clearCart} variant="danger" size="sm">
                      <Trash2 size={16} />
                      Clear All
                    </MechanicalButton>
                  </div>

                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white">{item.burger.name}</h3>
                            <p className="text-gray-400">${item.burger.price.toFixed(2)} each</p>
                            {item.customizations.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {item.customizations.map((custom, i) => (
                                  <div key={i} className="flex items-center gap-2 text-sm">
                                    <span className="text-blue-300">• {custom.name}</span>
                                    {custom.price > 0 && (
                                      <span className="text-orange-400">+${custom.price.toFixed(2)}</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            {item.comments && (
                              <div className="mt-2 p-2 bg-blue-600/20 rounded border border-blue-500/30">
                                <p className="text-blue-300 text-sm">💬 {item.comments}</p>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-orange-400 mb-2">
                              ${item.totalPrice.toFixed(2)}
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(index, item.quantity - 1)}
                                className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="text-white font-bold w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(index, item.quantity + 1)}
                                className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(index)}
                              className="mt-2 text-red-400 hover:text-red-300 text-sm transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </MechanicalCard>
            </div>

            {/* Order Summary & Checkout */}
            <div className="space-y-6">
              <MechanicalCard>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal:</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-600 pt-4">
                      <div className="flex justify-between text-xl font-bold text-white">
                        <span>Total:</span>
                        <span className="text-orange-400">${cartTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        CUSTOMER NAME:
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        PHONE NUMBER:
                      </label>
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

                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        ORDER TYPE:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setOrderType('dine-in')}
                          className={`px-4 py-3 rounded-lg border-2 transition-all text-sm ${
                            orderType === 'dine-in'
                              ? 'border-green-500 bg-green-500/20 text-green-300'
                              : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                          }`}
                        >
                          🍽️ DINE IN
                        </button>
                        <button
                          onClick={() => setOrderType('takeaway')}
                          className={`px-4 py-3 rounded-lg border-2 transition-all text-sm ${
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
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        SPECIAL COMMENTS (Optional):
                      </label>
                      <textarea
                        value={orderComments}
                        onChange={(e) => setOrderComments(e.target.value)}
                        placeholder="Any special requests or notes..."
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        rows={3}
                      />
                    </div>

                    <MechanicalButton
                      onClick={placeOrder}
                      disabled={!customerName.trim() || !phoneNumber.trim() || !!phoneError || placing}
                      className="w-full"
                      size="lg"
                    >
                      {placing ? 'PLACING ORDER...' : 'PLACE ORDER'}
                    </MechanicalButton>
                  </div>
                </div>
              </MechanicalCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};