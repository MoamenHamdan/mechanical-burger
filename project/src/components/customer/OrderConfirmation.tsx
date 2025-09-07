import React from 'react';
import { CheckCircle, Clock, Wrench } from 'lucide-react';
import { Order } from '../../types';
import { MechanicalCard } from '../ui/MechanicalCard';
import { MechanicalButton } from '../ui/MechanicalButton';
import { GearAnimation } from '../ui/GearAnimation';
import { useLanguage } from '../../hooks/useLanguage';

interface OrderConfirmationProps {
  order: Order;
  onNewOrder: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order, onNewOrder }) => {
  const { isRTL } = useLanguage();
  
  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-2xl w-full">
        <MechanicalCard hover={false}>
          <div className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <CheckCircle size={80} className="text-green-400" />
                <GearAnimation size="lg" className="absolute -top-2 -right-2 text-blue-400" />
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-2">ORDER CONFIRMED</h2>
            <p className="text-xl text-gray-300 mb-8">Your mechanical masterpiece is being assembled!</p>
            
            <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-600">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-300">ORDER ID</span>
                <span className="text-lg font-bold text-blue-400">#{order.id}</span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-300">CUSTOMER</span>
                <span className="text-lg font-bold text-white">{order.customerName}</span>
              </div>
              
              {order.orderType && (
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-300">ORDER TYPE</span>
                  <span className={`text-lg font-bold ${order.orderType === 'delivery' ? 'text-blue-400' : 'text-green-400'}`}>
                    {order.orderType === 'delivery' ? '🚚 DELIVERY' : '🍽️ DINE IN'}
                  </span>
                </div>
              )}
              
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start p-3 bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-bold text-white">{item.quantity}x {item.burger.name}</h4>
                      {item.customizations.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {item.customizations.map((custom, i) => (
                            <span key={i} className="block text-sm text-blue-300">
                              • {custom.name} {custom.price > 0 && `(+$${custom.price.toFixed(2)})`}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-orange-400 font-bold">${item.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-600 mt-4 pt-4">
                <div className="flex justify-between text-2xl font-bold">
                  <span className="text-white">TOTAL</span>
                  <span className="text-orange-400">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4 mb-8 p-4 bg-blue-600/20 rounded-lg border border-blue-500/30">
              <Clock className="text-blue-400" size={24} />
              <span className="text-lg font-semibold text-blue-300">
                ESTIMATED PREP TIME: {order.estimatedTime} MINUTES
              </span>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300">
                Our kitchen is ready to assemble your order!
              </p>
              
              <MechanicalButton onClick={onNewOrder} size="lg" className="w-full">
                <Wrench size={20} />
                <span className="mx-2">ORDER ANOTHER</span>
                <Wrench size={20} />
              </MechanicalButton>
            </div>
          </div>
        </MechanicalCard>
      </div>
    </div>
  );
};