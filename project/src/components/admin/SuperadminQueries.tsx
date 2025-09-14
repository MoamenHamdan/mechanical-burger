import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Trophy, Filter, Download, Eye } from 'lucide-react';
import { Order, Category, Burger } from '../../types';
import { MechanicalCard } from '../ui/MechanicalCard';
import { MechanicalButton } from '../ui/MechanicalButton';

interface SuperadminQueriesProps {
  orders: Order[];
  categories: Category[];
  burgers: Burger[];
}

export const SuperadminQueries: React.FC<SuperadminQueriesProps> = ({ orders, categories }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrderType, setSelectedOrderType] = useState<string>('all');
  const [activeQuery, setActiveQuery] = useState<string>('overview');

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
    return orders.filter(order => {
      const ts = getSafeTime(order.timestamp);
      if (startDate) {
        const s = getSafeTime(startDate + 'T00:00:00');
        if (ts < s) return false;
      }
      if (endDate) {
        const e = getSafeTime(endDate + 'T23:59:59');
        if (ts > e) return false;
      }
      if (selectedStatus !== 'all' && order.status !== selectedStatus) return false;
      if (selectedOrderType !== 'all' && order.orderType !== selectedOrderType) return false;
      if (selectedCategory !== 'all') {
        const hasCategory = order.items.some(item => item.burger.categoryId === selectedCategory);
        if (!hasCategory) return false;
      }
      return true;
    });
  }, [orders, startDate, endDate, selectedCategory, selectedStatus, selectedOrderType]);

  const analytics = useMemo(() => {
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (Number.isFinite(order.totalAmount) ? order.totalAmount : 0), 0);
    const totalOrders = filteredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const completedOrders = filteredOrders.filter(order => order.status === 'completed').length;
    const pendingOrders = filteredOrders.filter(order => order.status === 'pending').length;
    const preparingOrders = filteredOrders.filter(order => order.status === 'preparing').length;
    const readyOrders = filteredOrders.filter(order => order.status === 'ready').length;

    const itemMap = new Map<string, { name: string; quantity: number; revenue: number; category: string }>();
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const categoryName = categories.find(c => c.id === item.burger.categoryId)?.name || 'Unknown';
        const existing = itemMap.get(item.burger.id) || { name: item.burger.name, quantity: 0, revenue: 0, category: categoryName };
        existing.quantity += item.quantity;
        existing.revenue += item.totalPrice;
        itemMap.set(item.burger.id, existing);
      });
    });

    const topItems = Array.from(itemMap.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      completedOrders,
      pendingOrders,
      preparingOrders,
      readyOrders,
      topItems
    };
  }, [filteredOrders, categories]);

  const exportData = () => {
    const data = {
      summary: {
        totalRevenue: analytics.totalRevenue,
        totalOrders: analytics.totalOrders,
        averageOrderValue: analytics.averageOrderValue,
        completedOrders: analytics.completedOrders
      },
      orders: filteredOrders
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mechanical-burger-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const queryTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'orders', label: 'Order Details', icon: Eye }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <BarChart3 className="text-blue-400" />
          SUPERADMIN ANALYTICS
        </h2>
        <MechanicalButton onClick={exportData} variant="secondary">
          <Download size={16} />
          Export Data
        </MechanicalButton>
      </div>

      <MechanicalCard>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="text-blue-400" />
            <h3 className="text-lg font-bold text-white">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">FROM DATE</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">TO DATE</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">CATEGORY</label>
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm">
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">STATUS</label>
              <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm">
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">ORDER TYPE</label>
              <select value={selectedOrderType} onChange={e => setSelectedOrderType(e.target.value)} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm">
                <option value="all">All Types</option>
                <option value="dine-in">Dine In</option>
                <option value="takeaway">Takeaway</option>
              </select>
            </div>
          </div>
        </div>
      </MechanicalCard>

      <div className="flex flex-wrap gap-2">
        {queryTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveQuery(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeQuery === tab.id ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeQuery === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MechanicalCard>
            <div className="p-6 text-center">
              <DollarSign size={32} className="text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">${analytics.totalRevenue.toFixed(2)}</div>
              <div className="text-gray-400">TOTAL REVENUE</div>
            </div>
          </MechanicalCard>
          <MechanicalCard>
            <div className="p-6 text-center">
              <TrendingUp size={32} className="text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">${analytics.averageOrderValue.toFixed(2)}</div>
              <div className="text-gray-400">AVG ORDER VALUE</div>
            </div>
          </MechanicalCard>
          <MechanicalCard>
            <div className="p-6 text-center">
              <Users size={32} className="text-purple-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">{filteredOrders.length}</div>
              <div className="text-gray-400">TOTAL ORDERS</div>
            </div>
          </MechanicalCard>
          <MechanicalCard>
            <div className="p-6 text-center">
              <Trophy size={32} className="text-orange-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">{analytics.completedOrders}</div>
              <div className="text-gray-400">COMPLETED ORDERS</div>
            </div>
          </MechanicalCard>
        </div>
      )}

      {activeQuery === 'orders' && (
        <MechanicalCard>
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Filtered Orders ({filteredOrders.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-3 text-gray-400 font-semibold">ORDER ID</th>
                    <th className="text-left py-3 text-gray-400 font-semibold">CUSTOMER</th>
                    <th className="text-left py-3 text-gray-400 font-semibold">PHONE</th>
                    <th className="text-left py-3 text-gray-400 font-semibold">ITEMS</th>
                    <th className="text-left py-3 text-gray-400 font-semibold">TOTAL</th>
                    <th className="text-left py-3 text-gray-400 font-semibold">STATUS</th>
                    <th className="text-left py-3 text-gray-400 font-semibold">TYPE</th>
                    <th className="text-left py-3 text-gray-400 font-semibold">TIME</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.slice(0, 50).map((order) => (
                    <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                      <td className="py-3 text-blue-400 font-mono">#{order.id}</td>
                      <td className="py-3 text-white">{order.customerName}</td>
                      <td className="py-3 text-gray-300">{order.phoneNumber}</td>
                      <td className="py-3 text-gray-300">{order.items.length}</td>
                      <td className="py-3 text-green-400 font-bold">${order.totalAmount.toFixed(2)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          order.status === 'completed' ? 'bg-green-600 text-white' :
                          order.status === 'ready' ? 'bg-blue-600 text-white' :
                          order.status === 'preparing' ? 'bg-orange-600 text-white' :
                          'bg-red-600 text-white'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.orderType === 'takeaway' ? 'bg-blue-600/20 text-blue-300' : 'bg-green-600/20 text-green-300'
                        }`}>
                          {order.orderType?.toUpperCase() || 'DINE-IN'}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400 text-sm">
                        {new Date(order.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </MechanicalCard>
      )}
    </div>
  );
};

