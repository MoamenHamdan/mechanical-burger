import React, { useState } from 'react';
import { Settings, BarChart3, ChefHat, Clock, CheckCircle, User, Wrench, FolderPlus, Sliders } from 'lucide-react';
import { Burger, Order, Category, CustomizationOption } from '../../types';
import { BurgerManagement } from './BurgerManagement';
import { CategoryManagement } from './CategoryManagement';
import { CustomizationManagement } from './CustomizationManagement';
import { OrderAnalytics } from './OrderAnalytics';
import { MechanicalCard } from '../ui/MechanicalCard';
import { MechanicalButton } from '../ui/MechanicalButton';
import { GearAnimation } from '../ui/GearAnimation';
import { ordersService } from '../../services/firebaseService';

interface AdminViewProps {
  burgers: Burger[];
  categories: Category[];
  customizations: CustomizationOption[];
  orders: Order[];
}

export const AdminView: React.FC<AdminViewProps> = ({
  burgers,
  categories,
  customizations,
  orders,
}) => {
  const [activeTab, setActiveTab] = useState<'kitchen' | 'burgers' | 'categories' | 'customizations' | 'analytics'>('kitchen');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const preparingOrders = orders.filter(order => order.status === 'preparing');
  const readyOrders = orders.filter(order => order.status === 'ready');

  const formatTimeElapsed = (orderTime: Date) => {
    const elapsed = Math.floor((currentTime.getTime() - orderTime.getTime()) / 1000 / 60);
    return elapsed;
  };

  const handleOrderStatusChange = async (orderId: string, status: Order['status']) => {
    setLoading(true);
    try {
      await ordersService.updateStatus(orderId, status);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-4">
            <Settings size={48} className="text-red-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
              ADMIN CONTROL PANEL
            </h1>
            <GearAnimation size="lg" className="text-red-400" />
          </div>
          <p className="text-xl text-gray-300">Master Control Interface</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-600">
            <button
              onClick={() => setActiveTab('kitchen')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === 'kitchen'
                  ? 'bg-orange-600 text-white shadow-orange-500/30'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <ChefHat size={20} />
              <span>Kitchen Terminal</span>
            </button>
            
            <button
              onClick={() => setActiveTab('burgers')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === 'burgers'
                  ? 'bg-blue-600 text-white shadow-blue-500/30'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Settings size={20} />
              <span>Burger Management</span>
            </button>
            
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === 'categories'
                  ? 'bg-blue-600 text-white shadow-blue-500/30'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <FolderPlus size={20} />
              <span>Categories</span>
            </button>
            
            <button
              onClick={() => setActiveTab('customizations')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === 'customizations'
                  ? 'bg-blue-600 text-white shadow-blue-500/30'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Sliders size={20} />
              <span>Customizations</span>
            </button>
            
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white shadow-blue-500/30'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <BarChart3 size={20} />
              <span>Analytics</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'kitchen' ? (
          <div className="space-y-8">
            {/* Kitchen Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MechanicalCard>
                <div className="p-6 text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">{pendingOrders.length}</div>
                  <div className="text-gray-300">PENDING ORDERS</div>
                </div>
              </MechanicalCard>
              
              <MechanicalCard>
                <div className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2">{preparingOrders.length}</div>
                  <div className="text-gray-300">IN ASSEMBLY</div>
                </div>
              </MechanicalCard>
              
              <MechanicalCard>
                <div className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{readyOrders.length}</div>
                  <div className="text-gray-300">READY FOR PICKUP</div>
                </div>
              </MechanicalCard>
            </div>

            {/* Kitchen Orders */}
            <div className="space-y-8">
              {/* Pending Orders */}
              <div>
                <h2 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-3">
                  <Clock className="animate-pulse" />
                  INCOMING ORDERS
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pendingOrders.map((order) => (
                    <MechanicalCard key={order.id}>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                            <User className="text-blue-400" size={20} />
                            <span className="text-lg font-bold text-white">{order.customerName}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">#{order.id}</div>
                            <div className="text-sm text-orange-400">
                              {formatTimeElapsed(order.timestamp)} min ago
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                          {order.items.map((item, index) => (
                            <div key={index} className="bg-gray-800 p-3 rounded-lg border border-gray-600">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-white">{item.quantity}x {item.burger.name}</h4>
                                <span className="text-orange-400 font-bold">${item.totalPrice.toFixed(2)}</span>
                              </div>
                              {item.comments && (
                                <div className="mb-2 p-2 bg-blue-600/20 rounded border border-blue-500/30">
                                  <p className="text-blue-300 text-sm">💬 {item.comments}</p>
                                </div>
                              )}
                              {item.customizations.length > 0 && (
                                <div className="space-y-1">
                                  {item.customizations.map((custom, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                      <span className="text-blue-300">• {custom.name}</span>
                                      <span
                                        className={`px-2 py-0.5 rounded text-xs font-semibold
                                          ${custom.type === 'remove' ? 'bg-red-600 text-white' :
                                             custom.type === 'add' ? 'bg-green-600 text-white' :
                                             'bg-orange-600 text-white'}`}
                                      >
                                        {custom.type.toUpperCase()}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {order.comments && (
                          <div className="mb-4 p-3 bg-yellow-600/20 rounded border border-yellow-500/30">
                            <p className="text-yellow-300 text-sm">📝 Order Note: {order.comments}</p>
                          </div>
                        )}
                        
                        <MechanicalButton
                          onClick={() => handleOrderStatusChange(order.id, 'preparing')}
                          className="w-full"
                          variant="primary"
                          disabled={loading}
                        >
                          <Wrench size={18} />
                          <span>START ASSEMBLY</span>
                        </MechanicalButton>
                      </div>
                    </MechanicalCard>
                  ))}
                </div>
              </div>

              {/* Preparing Orders */}
              <div>
                <h2 className="text-2xl font-bold text-orange-400 mb-6 flex items-center gap-3">
                  <GearAnimation size="md" className="text-orange-400" />
                  IN ASSEMBLY
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {preparingOrders.map((order) => (
                    <MechanicalCard key={order.id}>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                            <User className="text-blue-400" size={20} />
                            <span className="text-lg font-bold text-white">{order.customerName}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">#{order.id}</div>
                            <div className="text-sm text-orange-400">
                              {formatTimeElapsed(order.timestamp)} min ago
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                          {order.items.map((item, index) => (
                            <div key={index} className="bg-gray-800 p-3 rounded-lg border border-orange-500/30">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-white">{item.quantity}x {item.burger.name}</h4>
                                <span className="text-orange-400 font-bold">${item.totalPrice.toFixed(2)}</span>
                              </div>
                              {item.customizations.length > 0 && (
                                <div className="space-y-1">
                                  {item.customizations.map((custom, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                      <span className="text-blue-300">• {custom.name}</span>
                                      <span
                                        className={`px-2 py-0.5 rounded text-xs font-semibold
                                          ${custom.type === 'remove' ? 'bg-red-600 text-white' :
                                             custom.type === 'add' ? 'bg-green-600 text-white' :
                                             'bg-orange-600 text-white'}`}
                                      >
                                        {custom.type.toUpperCase()}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        <MechanicalButton
                          onClick={() => handleOrderStatusChange(order.id, 'ready')}
                          className="w-full"
                          variant="secondary"
                          disabled={loading}
                        >
                          <CheckCircle size={18} />
                          <span>MARK AS READY</span>
                        </MechanicalButton>
                      </div>
                    </MechanicalCard>
                  ))}
                </div>
              {/* Ready Orders */}
              <div>
                <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-3">
                  <CheckCircle className="animate-pulse" />
                  READY FOR PICKUP
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {readyOrders.map((order) => (
                    <MechanicalCard key={order.id}>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                            <User className="text-blue-400" size={20} />
                            <span className="text-lg font-bold text-white">{order.customerName}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">#{order.id}</div>
                            <div className="text-sm text-green-400">READY</div>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                          {order.items.map((item, index) => (
                            <div key={index} className="bg-gray-800 p-3 rounded-lg border border-green-500/30">
                              <div className="flex justify-between items-start">
                                <h4 className="font-bold text-white">{item.quantity}x {item.burger.name}</h4>
                                <span className="text-orange-400 font-bold">${item.totalPrice.toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <MechanicalButton
                          onClick={() => handleOrderStatusChange(order.id, 'completed')}
                          className="w-full"
                          variant="secondary"
                          disabled={loading}
                        >
                          MARK AS COMPLETED
                        </MechanicalButton>
                      </div>
                    </MechanicalCard>
                  ))}
                </div>
              </div>
            </div>
              </div>
            {orders.length === 0 && (
              <div className="text-center py-20">
                <GearAnimation size="lg" className="text-gray-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-400 mb-2">KITCHEN IS READY</h3>
                <p className="text-gray-500">Kitchen is ready for incoming orders</p>
              </div>
            )}
          </div>
        ) : activeTab === 'burgers' ? (
          <BurgerManagement
            burgers={burgers}
            categories={categories}
          />
        ) : activeTab === 'categories' ? (
          <CategoryManagement
            categories={categories}
          />
        ) : activeTab === 'customizations' ? (
          <CustomizationManagement
            customizations={customizations}
            categories={categories}
          />
        ) : (
          <OrderAnalytics orders={orders} />
        )}
      </div>
    </div>
  );
};