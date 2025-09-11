import React, { useRef, useState } from 'react';
import { Settings, BarChart3, ChefHat, Clock, CheckCircle, User, Wrench, FolderPlus, Sliders, Lock, Shield, X, Trash2, Phone } from 'lucide-react';
import logo from '../../images /logo.png';
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
  const [advancedAuth, setAdvancedAuth] = useState(false);
  const [advancedPassword, setAdvancedPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const knownPendingIdsRef = useRef<Set<string>>(new Set());
  const audioCtxRef = useRef<AudioContext | null>(null);
  const prevStatusesRef = useRef<Map<string, Order['status']>>(new Map());

  // Ensure audio context is resumed after any user interaction (to bypass autoplay restrictions)
  React.useEffect(() => {
    const resumeAudio = () => {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        if (ctx && ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
      } catch {}
    };
    window.addEventListener('click', resumeAudio);
    window.addEventListener('touchstart', resumeAudio, { passive: true } as any);
    return () => {
      window.removeEventListener('click', resumeAudio);
      window.removeEventListener('touchstart', resumeAudio as any);
    };
  }, []);

  // Play a short notification tone when a new PENDING order arrives (kitchen tab)
  React.useEffect(() => {
    if (activeTab !== 'kitchen') return;
    const currentPendingIds = new Set(orders.filter(o => o.status === 'pending').map(o => o.id));
    let hasNewPending = false;
    currentPendingIds.forEach(id => {
      if (!knownPendingIdsRef.current.has(id)) {
        hasNewPending = true;
      }
    });
    knownPendingIdsRef.current = currentPendingIds;
    if (!hasNewPending) return;

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        // Will be resumed on next interaction
        return;
      }
      const duration = 0.3;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.25, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch {}
  }, [orders, activeTab]);

  // Play tones on status transitions: preparing (assembly), ready, completed (finish)
  React.useEffect(() => {
    if (activeTab !== 'kitchen') return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      // Inspect changes
      orders.forEach(o => {
        const prev = prevStatusesRef.current.get(o.id);
        if (prev && prev !== o.status) {
          // Transition detected
          const play = (freq: number, duration = 0.25) => {
            if (!ctx || ctx.state === 'suspended') return;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(0.22, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
            osc.connect(gain).connect(ctx.destination);
            osc.start(now);
            osc.stop(now + duration);
          };
          if (o.status === 'preparing') play(900); // start assembly
          if (o.status === 'ready') play(600);     // ready
          if (o.status === 'completed') play(440); // finished
        }
        // update snapshot
        prevStatusesRef.current.set(o.id, o.status);
      });
    } catch {}
  }, [orders, activeTab]);

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    // Check if advanced admin is already authenticated
    const isAdvancedAuthed = sessionStorage.getItem('advanced_admin_authed') === 'true';
    setAdvancedAuth(isAdvancedAuthed);
  }, []);

  const handleAdvancedAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for new password in localStorage/sessionStorage first
    const newPassword = localStorage.getItem('new_VITE_ADVANCED_ADMIN_PASSWORD') || 
                       sessionStorage.getItem('new_VITE_ADVANCED_ADMIN_PASSWORD');
    
    // Fall back to environment variable
    const expectedPassword = newPassword || import.meta.env.VITE_ADVANCED_ADMIN_PASSWORD || 'admin123';
    
    if (advancedPassword === expectedPassword) {
      sessionStorage.setItem('advanced_admin_authed', 'true');
      setAdvancedAuth(true);
      setAuthError('');
      setAdvancedPassword('');
    } else {
      setAuthError('Incorrect advanced admin password');
    }
  };

  const handleCancelAdvancedAuth = () => {
    setAdvancedPassword('');
    setAuthError('');
    setActiveTab('kitchen'); // Go back to kitchen tab
  };

  const isAdvancedFeature = (tab: string) => {
    return ['burgers', 'categories', 'customizations', 'analytics'].includes(tab);
  };

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

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    try {
      await ordersService.delete(orderId);
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order');
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
            <img src={logo} alt="Logo" className="h-12 w-12 rounded-md border border-orange-500" />
            <h1 className="text-5xl font-bold text-orange-400">
              ADMIN CONTROL PANEL
            </h1>
            <GearAnimation size="lg" className="text-orange-400" />
          </div>
          <p className="text-xl text-orange-300">Master Control Interface</p>
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
              {!advancedAuth && <Lock size={16} className="text-yellow-400" />}
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
              {!advancedAuth && <Lock size={16} className="text-yellow-400" />}
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
              {!advancedAuth && <Lock size={16} className="text-yellow-400" />}
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
              {!advancedAuth && <Lock size={16} className="text-yellow-400" />}
            </button>
          </div>
        </div>

        {/* Advanced Admin Authentication Modal */}
        {!advancedAuth && isAdvancedFeature(activeTab) && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <MechanicalCard hover={false}>
              <div className="p-8 max-w-md w-full">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <Shield size={64} className="text-yellow-400" />
                      <Lock size={24} className="absolute -top-2 -right-2 text-red-400" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">ADVANCED ADMIN ACCESS</h2>
                  <p className="text-gray-300">
                    This feature requires advanced admin privileges
                  </p>
                </div>
                
                <form onSubmit={handleAdvancedAuth} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                      ADVANCED ADMIN PASSWORD:
                    </label>
                    <input
                      type="password"
                      value={advancedPassword}
                      onChange={(e) => setAdvancedPassword(e.target.value)}
                      placeholder="Enter advanced admin password"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                    />
                  </div>
                  
                  {authError && (
                    <div className="text-red-400 text-sm flex items-center gap-2">
                      <span>⚠️</span>
                      {authError}
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <MechanicalButton
                      onClick={() => handleAdvancedAuth({} as React.FormEvent)}
                      className="flex-1"
                      size="lg"
                    >
                      <Shield size={20} />
                      <span className="mx-2">UNLOCK FEATURES</span>
                      <Shield size={20} />
                    </MechanicalButton>
                    
                    <MechanicalButton
                      onClick={handleCancelAdvancedAuth}
                      className="flex-1"
                      size="lg"
                      variant="secondary"
                    >
                      <X size={20} />
                      <span className="mx-2">CANCEL</span>
                      <X size={20} />
                    </MechanicalButton>
                  </div>
                </form>
              </div>
            </MechanicalCard>
          </div>
        )}

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
                            <div>
                              <span className="text-lg font-bold text-white">{order.customerName}</span>
                              <div className="flex items-center space-x-1 mt-1">
                                <Phone className="text-blue-400" size={14} />
                                <span className="text-sm text-blue-400">{order.phoneNumber}</span>
                              </div>
                            </div>
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
                        
                        <div className="flex gap-2">
                          <MechanicalButton
                            onClick={() => handleOrderStatusChange(order.id, 'preparing')}
                            className="flex-1"
                            variant="primary"
                            disabled={loading}
                          >
                            <Wrench size={18} />
                            <span>START ASSEMBLY</span>
                          </MechanicalButton>
                          <MechanicalButton
                            onClick={() => handleDeleteOrder(order.id)}
                            variant="danger"
                            disabled={loading}
                            className="px-4"
                          >
                            <Trash2 size={18} />
                          </MechanicalButton>
                        </div>
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
                            <div>
                              <span className="text-lg font-bold text-white">{order.customerName}</span>
                              <div className="flex items-center space-x-1 mt-1">
                                <Phone className="text-blue-400" size={14} />
                                <span className="text-sm text-blue-400">{order.phoneNumber}</span>
                              </div>
                            </div>
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
                        
                        <div className="flex gap-2">
                          <MechanicalButton
                            onClick={() => handleOrderStatusChange(order.id, 'ready')}
                            className="flex-1"
                            variant="secondary"
                            disabled={loading}
                          >
                            <CheckCircle size={18} />
                            <span>MARK AS READY</span>
                          </MechanicalButton>
                          <MechanicalButton
                            onClick={() => handleDeleteOrder(order.id)}
                            variant="danger"
                            disabled={loading}
                            className="px-4"
                          >
                            <Trash2 size={18} />
                          </MechanicalButton>
                        </div>
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
                            <div>
                              <span className="text-lg font-bold text-white">{order.customerName}</span>
                              <div className="flex items-center space-x-1 mt-1">
                                <Phone className="text-blue-400" size={14} />
                                <span className="text-sm text-blue-400">{order.phoneNumber}</span>
                              </div>
                            </div>
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
                        
                        <div className="flex gap-2">
                          <MechanicalButton
                            onClick={() => handleOrderStatusChange(order.id, 'completed')}
                            className="flex-1"
                            variant="secondary"
                            disabled={loading}
                          >
                            MARK AS COMPLETED
                          </MechanicalButton>
                          <MechanicalButton
                            onClick={() => handleDeleteOrder(order.id)}
                            variant="danger"
                            disabled={loading}
                            className="px-4"
                          >
                            <Trash2 size={18} />
                          </MechanicalButton>
                        </div>
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
        ) : activeTab === 'burgers' && advancedAuth ? (
          <BurgerManagement
            burgers={burgers}
            categories={categories}
          />
        ) : activeTab === 'categories' && advancedAuth ? (
          <CategoryManagement
            categories={categories}
          />
        ) : activeTab === 'customizations' && advancedAuth ? (
          <CustomizationManagement
            customizations={customizations}
            categories={categories}
          />
        ) : activeTab === 'analytics' && advancedAuth ? (
          <OrderAnalytics orders={orders} categories={categories} />
        ) : isAdvancedFeature(activeTab) ? (
          <div className="text-center py-20">
            <Lock size={64} className="text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">FEATURE LOCKED</h3>
            <p className="text-gray-500">Advanced admin authentication required</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};