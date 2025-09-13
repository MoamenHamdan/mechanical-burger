@@ .. @@
 import React, { useRef, useState } from 'react';
-import { Settings, List, ChefHat, Clock, CheckCircle, User, Wrench, FolderPlus, Sliders, Lock, Shield, X, Trash2, Phone } from 'lucide-react';
+import { Settings, List, ChefHat, Clock, CheckCircle, User, Wrench, FolderPlus, Sliders, Lock, Shield, X, Trash2, Phone, BarChart3 } from 'lucide-react';
 import logo from '../../images /logo.png';
 import { Burger, Order, Category, CustomizationOption } from '../../types';
 import { BurgerManagement } from './BurgerManagement';
 import { CategoryManagement } from './CategoryManagement';
 import { CustomizationManagement } from './CustomizationManagement';
+import { SuperadminQueries } from './SuperadminQueries';
+import { OrderDetailsModal } from './OrderDetailsModal';
 // import { OrderAnalytics } from './OrderAnalytics';
 import { MechanicalCard } from '../ui/MechanicalCard';
 import { MechanicalButton } from '../ui/MechanicalButton';
 import { GearAnimation } from '../ui/GearAnimation';
-import { ordersService } from '../../services/firebaseService';
+import { ordersService } from '../../services/firebaseService';
+import { deletedOrdersService } from '../../services/deletedOrdersService';
 
 interface AdminViewProps {
   burgers: Burger[];
   categories: Category[];
   customizations: CustomizationOption[];
   orders: Order[];
+  deletedOrders?: Order[];
 }
 
 export const AdminView: React.FC<AdminViewProps> = ({
   burgers,
   categories,
   customizations,
   orders,
+  deletedOrders = []
 }) => {
-  const [activeTab, setActiveTab] = useState<'kitchen' | 'burgers' | 'categories' | 'customizations' | 'lastOrders'>('kitchen');
+  const [activeTab, setActiveTab] = useState<'kitchen' | 'burgers' | 'categories' | 'customizations' | 'lastOrders' | 'queries'>('kitchen');
   // const [currentTime, setCurrentTime] = useState(new Date());
   const [loading, setLoading] = useState(false);
   const [advancedAuth, setAdvancedAuth] = useState(false);
   const [advancedPassword, setAdvancedPassword] = useState('');
   const [authError, setAuthError] = useState('');
+  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
   const knownPendingIdsRef = useRef<Set<string>>(new Set());
   const audioCtxRef = useRef<AudioContext | null>(null);
   const prevStatusesRef = useRef<Map<string, Order['status']>>(new Map());
@@ -108,7 +115,7 @@ export const AdminView: React.FC<AdminViewProps> = ({
   };
 
   const isAdvancedFeature = (tab: string) => {
-    return ['burgers', 'categories', 'customizations', 'analytics'].includes(tab);
+    return ['burgers', 'categories', 'customizations', 'analytics', 'queries'].includes(tab);
   };
 
   const pendingOrders = orders.filter(order => order.status === 'pending');
@@ -122,8 +129,12 @@ export const AdminView: React.FC<AdminViewProps> = ({
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
+      // First, save to deleted orders
+      const orderToDelete = orders.find(o => o.id === orderId);
+      if (orderToDelete) {
+        await deletedOrdersService.create(orderToDelete);
+      }
+      
+      // Then delete from active orders
       await ordersService.delete(orderId);
     } catch (error) {
       console.error('Error deleting order:', error);
       alert('Failed to delete order');
     } finally {
       setLoading(false);
     }
   };
@@ .. @@
             <button
-              onClick={() => setActiveTab('lastOrders')}
+              onClick={() => setActiveTab('queries')}
               className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
-                activeTab === 'lastOrders'
+                activeTab === 'queries'
                   ? 'bg-blue-600 text-white shadow-blue-500/30'
                   : 'text-gray-300 hover:text-white'
               }`}
             >
-              <List size={20} />
-              <span>Last Orders</span>
+              <BarChart3 size={20} />
+              <span>Queries</span>
+              {!advancedAuth && <Lock size={16} className="text-yellow-400" />}
+            </button>
+            
+            <button
+              onClick={() => setActiveTab('lastOrders')}
+              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
+                activeTab === 'lastOrders'
+                  ? 'bg-blue-600 text-white shadow-blue-500/30'
+                  : 'text-gray-300 hover:text-white'
+              }`}
+            >
+              <List size={20} />
+              <span>All Orders</span>
               {!advancedAuth && <Lock size={16} className="text-yellow-400" />}
             </button>
           </div>
@@ .. @@
         ) : activeTab === 'customizations' && advancedAuth ? (
           <CustomizationManagement
             customizations={customizations}
             categories={categories}
           />
+        ) : activeTab === 'queries' && advancedAuth ? (
+          <SuperadminQueries
+            orders={[...orders, ...deletedOrders]}
+            categories={categories}
+            burgers={burgers}
+          />
         ) : activeTab === 'lastOrders' && advancedAuth ? (
           <div className="space-y-6">
             <MechanicalCard hover={false}>
               <div className="p-6">
-                <div className="mb-4 p-3 bg-blue-600/10 border border-blue-500/30 rounded text-blue-300 text-sm">
-                  This page lists recently completed or removed orders. Click an order to view details.
+                <div className="flex items-center justify-between mb-6">
+                  <h2 className="text-2xl font-bold text-white">All Orders History</h2>
+                  <div className="flex items-center gap-4 text-sm">
+                    <span className="text-green-400">● Active Orders: {orders.length}</span>
+                    <span className="text-red-400">● Deleted Orders: {deletedOrders.length}</span>
+                  </div>
+                </div>
+                
+                <div className="mb-4 p-3 bg-blue-600/10 border border-blue-500/30 rounded text-blue-300 text-sm">
+                  This page shows all orders including active and deleted ones. Click any order to view full details.
                 </div>
+                
                 <div className="overflow-x-auto">
                   <table className="w-full">
                     <thead>
                       <tr className="border-b border-gray-600">
                         <th className="text-left py-3 text-gray-400 font-semibold">ORDER ID</th>
                         <th className="text-left py-3 text-gray-400 font-semibold">CUSTOMER</th>
                         <th className="text-left py-3 text-gray-400 font-semibold">PHONE</th>
+                        <th className="text-left py-3 text-gray-400 font-semibold">ITEMS</th>
                         <th className="text-left py-3 text-gray-400 font-semibold">TOTAL</th>
                         <th className="text-left py-3 text-gray-400 font-semibold">STATUS</th>
+                        <th className="text-left py-3 text-gray-400 font-semibold">TYPE</th>
                         <th className="text-left py-3 text-gray-400 font-semibold">TIME</th>
                       </tr>
                     </thead>
                     <tbody>
-                      {orders
-                        .filter(o => o.status === 'completed')
+                      {/* Active Orders */}
+                      {orders
                         .slice(0, 50)
-                        .map((order) => (
-                          <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-800/50 cursor-pointer" onClick={() => alert(`#${order.id} details page coming soon`)}>
+                        .map((order) => (
+                          <tr 
+                            key={order.id} 
+                            className="border-b border-gray-700 hover:bg-gray-800/50 cursor-pointer" 
+                            onClick={() => setSelectedOrder(order)}
+                          >
                             <td className="py-3 text-blue-400 font-mono">#{order.id}</td>
                             <td className="py-3 text-white">{order.customerName}</td>
                             <td className="py-3 text-gray-300">{order.phoneNumber}</td>
+                            <td className="py-3 text-gray-300">{order.items.length}</td>
                             <td className="py-3 text-orange-400 font-bold">${order.totalAmount.toFixed(2)}</td>
-                            <td className="py-3"><span className="px-2 py-1 rounded bg-green-600 text-white text-xs font-bold">COMPLETED</span></td>
+                            <td className="py-3">
+                              <span className={`px-2 py-1 rounded text-xs font-bold ${
+                                order.status === 'completed' ? 'bg-green-600 text-white' :
+                                order.status === 'ready' ? 'bg-blue-600 text-white' :
+                                order.status === 'preparing' ? 'bg-orange-600 text-white' :
+                                'bg-red-600 text-white'
+                              }`}>
+                                {order.status.toUpperCase()}
+                              </span>
+                            </td>
+                            <td className="py-3">
+                              <span className={`px-2 py-1 rounded text-xs ${
+                                order.orderType === 'takeaway' ? 'bg-blue-600/20 text-blue-300' : 'bg-green-600/20 text-green-300'
+                              }`}>
+                                {order.orderType?.toUpperCase() || 'DINE-IN'}
+                              </span>
+                            </td>
                             <td className="py-3 text-gray-400 text-sm">{formatTime(order.timestamp)}</td>
                           </tr>
                         ))}
-                      {orders.filter(o => o.status === 'completed').length === 0 && (
+                      
+                      {/* Deleted Orders */}
+                      {deletedOrders.slice(0, 50).map((order) => (
+                        <tr 
+                          key={`deleted-${order.id}`} 
+                          className="border-b border-gray-700 hover:bg-red-900/20 cursor-pointer opacity-75" 
+                          onClick={() => setSelectedOrder(order)}
+                        >
+                          <td className="py-3 text-red-400 font-mono">#{order.id}</td>
+                          <td className="py-3 text-gray-300">{order.customerName}</td>
+                          <td className="py-3 text-gray-400">{order.phoneNumber}</td>
+                          <td className="py-3 text-gray-400">{order.items.length}</td>
+                          <td className="py-3 text-red-400 font-bold">${order.totalAmount.toFixed(2)}</td>
+                          <td className="py-3">
+                            <span className="px-2 py-1 rounded bg-red-600 text-white text-xs font-bold">
+                              DELETED
+                            </span>
+                          </td>
+                          <td className="py-3">
+                            <span className={`px-2 py-1 rounded text-xs ${
+                              order.orderType === 'takeaway' ? 'bg-blue-600/20 text-blue-300' : 'bg-green-600/20 text-green-300'
+                            }`}>
+                              {order.orderType?.toUpperCase() || 'DINE-IN'}
+                            </span>
+                          </td>
+                          <td className="py-3 text-gray-400 text-sm">{formatTime(order.timestamp)}</td>
+                        </tr>
+                      ))}
+                      
+                      {orders.length === 0 && deletedOrders.length === 0 && (
                         <tr>
-                          <td className="py-6 text-center text-gray-500" colSpan={6}>No finished orders yet</td>
+                          <td className="py-6 text-center text-gray-500" colSpan={8}>No orders found</td>
                         </tr>
                       )}
                     </tbody>
@@ -456,6 +530,10 @@ export const AdminView: React.FC<AdminViewProps> = ({
           </div>
         ) : null}
       </div>
+      
+      {/* Order Details Modal */}
+      {selectedOrder && (
+        <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
+      )}
     </div>
   );
 };