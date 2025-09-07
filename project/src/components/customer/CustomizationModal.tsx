import React, { useState } from 'react';
import { X, Plus, Minus, Wrench, MessageSquare } from 'lucide-react';
import { Burger, CustomizationOption, Order, OrderItem, Category } from '../../types';
import { MechanicalButton } from '../ui/MechanicalButton';
import { MechanicalCard } from '../ui/MechanicalCard';
import { ordersService } from '../../services/firebaseService';

interface CustomizationModalProps {
  burger: Burger;
  categories: Category[];
  customizations: CustomizationOption[];
  onClose: () => void;
  onOrderComplete: (order: Order) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  burger,
  categories,
  customizations,
  onClose,
  onOrderComplete
}) => {
  const [customerName, setCustomerName] = useState('');
  const [comments, setComments] = useState('');
  const [selectedCustomizations, setSelectedCustomizations] = useState<CustomizationOption[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState<'dine-in' | 'delivery'>('dine-in');

  // Filter customizations for this burger's category or global ones
  const availableCustomizations = customizations.filter(
    c => !c.categoryId || c.categoryId === burger.categoryId
  );

  const toggleCustomization = (option: CustomizationOption) => {
    setSelectedCustomizations(prev => {
      const exists = prev.find(c => c.id === option.id);
      if (exists) {
        return prev.filter(c => c.id !== option.id);
      }
      return [...prev, option];
    });
  };

  const calculateTotalPrice = () => {
    const basePrice = burger.price * quantity;
    const customizationPrice = selectedCustomizations.reduce((sum, c) => sum + c.price, 0) * quantity;
    return basePrice + customizationPrice;
  };

  const handleOrder = async () => {
    if (!customerName.trim()) return;

    setLoading(true);
    try {
      const orderItem: OrderItem = {
        burger,
        customizations: selectedCustomizations,
        quantity,
        totalPrice: calculateTotalPrice(),
      };

      const order: Order = {
        id: Date.now().toString(),
        customerName: customerName.trim(),
        items: [orderItem],
        totalAmount: calculateTotalPrice(),
        timestamp: new Date(),
        status: 'pending',
        estimatedTime: Math.floor(Math.random() * 15) + 10,
        comments: comments.trim() || undefined,
        orderType: orderType
      };

      await ordersService.create(order);
      onOrderComplete(order);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <MechanicalCard hover={false}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <Wrench className="text-blue-400" />
                Customize Your {burger.name}
              </h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Burger Preview & Basic Info */}
              <div className="space-y-6">
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src={burger.image} 
                    alt={burger.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">{burger.name}</h3>
                  <p className="text-gray-300">{burger.description}</p>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">BASE COMPONENTS:</h4>
                    <div className="flex flex-wrap gap-2">
                      {burger.ingredients.map((ingredient, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-md border border-gray-600"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Customization Options & Order Details */}
              <div className="space-y-6">
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
                    ORDER TYPE:
                  </label>
                  <div className="flex gap-4">
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
                      onClick={() => setOrderType('delivery')}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                        orderType === 'delivery'
                          ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                          : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      🚚 DELIVERY
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">MODIFICATIONS:</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {availableCustomizations.map((option) => {
                      const isSelected = selectedCustomizations.find(c => c.id === option.id);
                      return (
                        <div
                          key={option.id}
                          onClick={() => toggleCustomization(option)}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                            isSelected
                              ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                              : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                              isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-500'
                            }`}>
                              {isSelected && <div className="w-2 h-2 bg-white rounded"></div>}
                            </div>
                            <span className="font-medium">{option.name}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              option.type === 'remove' ? 'bg-red-500/20 text-red-300' :
                              option.type === 'add' ? 'bg-green-500/20 text-green-300' :
                              'bg-orange-500/20 text-orange-300'
                            }`}>
                              {option.type.toUpperCase()}
                            </span>
                          </div>
                          <span className="font-bold">
                            {option.price > 0 ? `+$${option.price.toFixed(2)}` : 'FREE'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                    <MessageSquare size={16} />
                    SPECIAL COMMENTS (Optional):
                  </label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Any special requests or notes..."
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <span className="text-gray-300 font-medium">QUANTITY:</span>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-xl font-bold text-white w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between text-2xl font-bold text-white mb-4">
                    <span>TOTAL:</span>
                    <span className="text-orange-400">${calculateTotalPrice().toFixed(2)}</span>
                  </div>
                  
                  <MechanicalButton
                    onClick={handleOrder}
                    disabled={!customerName.trim() || loading}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? 'PLACING ORDER...' : 'PLACE ORDER'}
                  </MechanicalButton>
                </div>
              </div>
            </div>
          </div>
        </MechanicalCard>
      </div>
    </div>
  );
};