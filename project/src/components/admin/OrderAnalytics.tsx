import React, { useMemo, useState } from 'react';
import { TrendingUp, DollarSign, Clock, Users, Trophy, Tag } from 'lucide-react';
import { Order, Category } from '../../types';
import { MechanicalCard } from '../ui/MechanicalCard';

interface OrderAnalyticsProps {
  orders: Order[];
  categories: Category[];
}

export const OrderAnalytics: React.FC<OrderAnalyticsProps> = ({ orders, categories }) => {
  // const { t } = useLanguage();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const getSafeTime = (input: any): number => {
    try {
      const d = new Date(input);
      const t = d.getTime();
      return Number.isFinite(t) ? t : 0;
    } catch {
      return 0;
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const ts = getSafeTime(o.timestamp);
      if (startDate) {
        const s = getSafeTime(startDate + 'T00:00:00');
        if (ts < s) return false;
      }
      if (endDate) {
        const e = getSafeTime(endDate + 'T23:59:59');
        if (ts > e) return false;
      }
      return true;
    });
  }, [orders, startDate, endDate]);
  
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (Number.isFinite(order.totalAmount) ? order.totalAmount : 0), 0);
  const averageOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;
  const completedOrders = filteredOrders.filter(order => order.status === 'completed').length;
  const averageWaitTimeRaw = filteredOrders.length > 0 
    ? filteredOrders.reduce((sum, order) => sum + (Number.isFinite(order.estimatedTime) ? order.estimatedTime : 0), 0) / filteredOrders.length 
    : 0;
  const averageWaitTime = Number.isFinite(averageWaitTimeRaw) ? averageWaitTimeRaw : 0;

  const recentOrders = filteredOrders
    .slice()
    .sort((a, b) => getSafeTime(b.timestamp) - getSafeTime(a.timestamp))
    .slice(0, 10);

  // Top sellers (items)
  const topItems = useMemo(() => {
    const map = new Map<string, { name: string; quantity: number; revenue: number }>();
    for (const order of filteredOrders) {
      const items = Array.isArray(order.items) ? order.items : [];
      for (const item of items) {
        if (!item || !item.burger) continue;
        const id = item.burger.id;
        const name = item.burger.name || 'Unknown';
        const entry = map.get(id) || { name, quantity: 0, revenue: 0 };
        const qty = typeof item.quantity === 'number' && Number.isFinite(item.quantity) ? item.quantity : 0;
        const revenueToAdd = typeof item.totalPrice === 'number' && Number.isFinite(item.totalPrice) ? item.totalPrice : 0;
        entry.quantity += qty;
        entry.revenue += revenueToAdd;
        map.set(id, entry);
      }
    }
    return Array.from(map.entries())
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [filteredOrders]);

  // Top categories
  const categoryIdToName = useMemo(() => {
    const m = new Map<string, string>();
    categories.forEach(c => m.set(c.id, c.name));
    return m;
  }, [categories]);

  const topCategories = useMemo(() => {
    const map = new Map<string, { name: string; quantity: number; revenue: number }>();
    for (const order of filteredOrders) {
      const items = Array.isArray(order.items) ? order.items : [];
      for (const item of items) {
        if (!item || !item.burger) continue;
        const catId = item.burger.categoryId || 'unknown';
        const displayName = categoryIdToName.get(catId) || 'Uncategorized';
        const entry = map.get(catId) || { name: displayName, quantity: 0, revenue: 0 };
        const qty = typeof item.quantity === 'number' && Number.isFinite(item.quantity) ? item.quantity : 0;
        const revenueToAdd = typeof item.totalPrice === 'number' && Number.isFinite(item.totalPrice) ? item.totalPrice : 0;
        entry.quantity += qty;
        entry.revenue += revenueToAdd;
        map.set(catId, entry);
      }
    }
    return Array.from(map.entries())
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [filteredOrders, categoryIdToName]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">ANALYTICS DASHBOARD</h2>
        <div className="flex items-end gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">FROM</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">TO</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white" />
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MechanicalCard>
          <div className="p-6 text-center">
            <DollarSign size={32} className="text-green-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">${totalRevenue.toFixed(2)}</div>
            <div className="text-gray-400">TOTAL REVENUE</div>
          </div>
        </MechanicalCard>
        
        <MechanicalCard>
          <div className="p-6 text-center">
            <TrendingUp size={32} className="text-blue-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">${averageOrderValue.toFixed(2)}</div>
            <div className="text-gray-400">AVG ORDER VALUE</div>
          </div>
        </MechanicalCard>
        
        <MechanicalCard>
          <div className="p-6 text-center">
            <Users size={32} className="text-purple-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">{completedOrders}</div>
            <div className="text-gray-400">COMPLETED ORDERS</div>
          </div>
        </MechanicalCard>
        
        <MechanicalCard>
          <div className="p-6 text-center">
            <Clock size={32} className="text-orange-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">{averageWaitTime.toFixed(0)} min</div>
            <div className="text-gray-400">AVG WAIT TIME</div>
          </div>
        </MechanicalCard>
      </div>

      {/* Recent Orders */}
      <MechanicalCard hover={false}>
        <div className="p-6">
          <h3 className="text-2xl font-bold text-white mb-6">RECENT ORDERS</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-3 text-gray-400 font-semibold">ORDER ID</th>
                  <th className="text-left py-3 text-gray-400 font-semibold">CUSTOMER</th>
                  <th className="text-left py-3 text-gray-400 font-semibold">ITEMS</th>
                  <th className="text-left py-3 text-gray-400 font-semibold">TOTAL</th>
                  <th className="text-left py-3 text-gray-400 font-semibold">STATUS</th>
                  <th className="text-left py-3 text-gray-400 font-semibold">TIME</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                    <td className="py-4 text-blue-400 font-mono">#{order.id}</td>
                    <td className="py-4 text-white font-medium">{order.customerName}</td>
                    <td className="py-4 text-gray-300">{Array.isArray(order.items) ? order.items.length : 0} item(s)</td>
                    <td className="py-4 text-orange-400 font-bold">${(typeof order.totalAmount === 'number' && Number.isFinite(order.totalAmount) ? order.totalAmount : 0).toFixed(2)}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'completed' ? 'bg-green-600 text-white' :
                        order.status === 'ready' ? 'bg-blue-600 text-white' :
                        order.status === 'preparing' ? 'bg-orange-600 text-white' :
                        'bg-red-600 text-white'
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 text-gray-400 text-sm">
                      {(() => { const d = new Date(order.timestamp); return Number.isFinite(d.getTime()) ? d.toLocaleTimeString() : '-'; })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {orders.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">NO ORDERS YET</div>
            </div>
          )}
        </div>
      </MechanicalCard>

      {/* Top Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MechanicalCard hover={false}>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2"><Trophy className="text-orange-400" /> TOP ITEMS</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-3 text-gray-400 font-semibold">ITEM</th>
                    <th className="text-left py-3 text-gray-400 font-semibold">QTY</th>
                    <th className="text-left py-3 text-gray-400 font-semibold">REVENUE</th>
                  </tr>
                </thead>
                <tbody>
                  {topItems.map(row => (
                    <tr key={row.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                      <td className="py-3 text-white font-medium">{row.name}</td>
                      <td className="py-3 text-gray-300">{row.quantity}</td>
                      <td className="py-3 text-orange-400 font-bold">${row.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                  {topItems.length === 0 && (
                    <tr>
                      <td className="py-4 text-gray-500" colSpan={3}>No data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </MechanicalCard>

        <MechanicalCard hover={false}>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2"><Tag className="text-orange-400" /> TOP CATEGORIES</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-3 text-gray-400 font-semibold">CATEGORY</th>
                    <th className="text-left py-3 text-gray-400 font-semibold">QTY</th>
                    <th className="text-left py-3 text-gray-400 font-semibold">REVENUE</th>
                  </tr>
                </thead>
                <tbody>
                  {topCategories.map(row => (
                    <tr key={row.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                      <td className="py-3 text-white font-medium">{row.name}</td>
                      <td className="py-3 text-gray-300">{row.quantity}</td>
                      <td className="py-3 text-orange-400 font-bold">${row.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                  {topCategories.length === 0 && (
                    <tr>
                      <td className="py-4 text-gray-500" colSpan={3}>No data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </MechanicalCard>
      </div>
    </div>
  );
};