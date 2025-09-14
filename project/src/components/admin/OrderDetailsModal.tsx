import React from 'react';
import { X, User, Phone, Clock, MapPin, MessageSquare } from 'lucide-react';
import { Order } from '../../types';
import { MechanicalCard } from '../ui/MechanicalCard';
import { MechanicalButton } from '../ui/MechanicalButton';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  const formatTime = (date: Date) => new Date(date).toLocaleString();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <MechanicalCard hover={false}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">Order Details - #{order.id}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg">
                <X size={24} />
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <User className="text-blue-400" />
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3"><User size={16} className="text-gray-400" /><span className="text-gray-300">Name:</span><span className="text-white font-semibold">{order.customerName}</span></div>
                    <div className="flex items-center gap-3"><Phone size={16} className="text-gray-400" /><span className="text-gray-300">Phone:</span><span className="text-blue-400 font-semibold">{order.phoneNumber}</span></div>
                    <div className="flex items-center gap-3"><MapPin size={16} className="text-gray-400" /><span className="text-gray-300">Type:</span><span className={`px-2 py-1 rounded text-xs font-bold ${order.orderType === 'takeaway' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>{order.orderType === 'takeaway' ? '🚚 TAKEAWAY' : '🍽️ DINE IN'}</span></div>
                    <div className="flex items-center gap-3"><Clock size={16} className="text-gray-400" /><span className="text-gray-300">Ordered:</span><span className="text-white">{formatTime(order.timestamp)}</span></div>
                    <div className="flex items-center gap-3"><span className="text-gray-300">Status:</span><span className={`px-3 py-1 rounded-full text-sm font-bold ${order.status === 'completed' ? 'bg-green-600 text-white' : order.status === 'ready' ? 'bg-blue-600 text-white' : order.status === 'preparing' ? 'bg-orange-600 text-white' : 'bg-red-600 text-white'}`}>{order.status.toUpperCase()}</span></div>
                  </div>
                </div>
                {order.comments && (
                  <div className="bg-yellow-600/20 rounded-lg p-4 border border-yellow-500/30">
                    <h4 className="text-yellow-300 font-semibold mb-2 flex items-center gap-2"><MessageSquare size={16} />Order Comments</h4>
                    <p className="text-yellow-200">{order.comments}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Order Items</h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-white">{item.quantity}x {item.burger.name}</h4>
                          <p className="text-gray-400">${item.burger.price.toFixed(2)} each</p>
                        </div>
                        <span className="text-xl font-bold text-orange-400">${item.totalPrice.toFixed(2)}</span>
                      </div>
                      {item.customizations.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-sm font-semibold text-gray-400 mb-2">Customizations:</h5>
                          <div className="space-y-1">
                            {item.customizations.map((custom, i) => (
                              <div key={i} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-blue-300">• {custom.name}</span>
                                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${custom.type === 'remove' ? 'bg-red-600 text-white' : custom.type === 'add' ? 'bg-green-600 text-white' : 'bg-orange-600 text-white'}`}>{custom.type.toUpperCase()}</span>
                                </div>
                                <span className="text-orange-400">{custom.price > 0 ? `+$${custom.price.toFixed(2)}` : 'FREE'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {item.comments && (
                        <div className="mt-3 p-2 bg-blue-600/20 rounded border border-blue-500/30">
                          <p className="text-blue-300 text-sm">💬 {item.comments}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-600 mt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-300"><span>Items ({order.items.reduce((sum, item) => sum + item.quantity, 0)}):</span><span>${order.items.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}</span></div>
                    <div className="border-t border-gray-600 pt-2"><div className="flex justify-between text-xl font-bold"><span className="text-white">Total:</span><span className="text-orange-400">${order.totalAmount.toFixed(2)}</span></div></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-8">
              <MechanicalButton onClick={onClose} variant="secondary">Close</MechanicalButton>
            </div>
          </div>
        </MechanicalCard>
      </div>
    </div>
  );
};

