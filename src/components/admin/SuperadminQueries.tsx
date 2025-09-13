import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, DollarSign, Clock, Users, Trophy, Tag, Calendar, Filter, Download, Eye } from 'lucide-react';
import { Order, Category, Burger } from '../../types';
import { MechanicalCard } from '../ui/MechanicalCard';
import { MechanicalButton } from '../ui/MechanicalButton';

interface SuperadminQueriesProps {
  orders: Order[];
  categories: Category[];
  burgers: Burger[];
}

export const SuperadminQueries: React.FC<SuperadminQueriesProps> = ({ orders, categories, burgers }) => {
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
      
      // Date filter
      if (startDate) {
        const s = getSafeTime(startDate + 'T00:00:00');
        if (ts < s) return false;
      }
      if (endDate) {
        const e = getSafeTime(endDate + 'T23:59:59');
        if (ts > e) return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && order.status !== selectedStatus) return false;

      // Order type filter
      if (selectedOrderType !== 'all' && order.orderType !== selectedOrderType) return false;

      // Category filter
      if (selectedCategory !== 'all') {
        const hasCategory = order.items.some(item => item.burger.categoryId === selectedCategory);
        if (!hasCategory) return false;
      }

      return true;
    });
  }, [orders, startDate, endDate, selectedCategory, selectedStatus, selectedOrderType]);

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (Number.isFinite(order.totalAmount) ? order.totalAmount : 0), 0);
    const totalOrders = filteredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const completedOrders = filteredOrders.filter(order => order.status === 'completed').length;
    const pendingOrders = filteredOrders.filter(order => order.status === 'pending').length;
    const preparingOrders = filteredOrders.filter(order => order.status === 'preparing').length;
    const readyOrders = filteredOrders.filter(order => order.status === 'ready').length;

    // Customer analytics
    const customerMap = new Map<string, { orders: number; revenue: number; phone: string }>();
    filteredOrders.forEach(order => {
      const existing = customerMap.get(order.customerName) || { orders: 0, revenue: 0, phone: order.phoneNumber };
      existing.orders += 1;
      existing.revenue += order.totalAmount;
      customerMap.set(order.customerName, existing);
    });

    const topCustomers = Array.from(customerMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Item analytics
    const itemMap = new Map<string, { name: string; quantity: number; revenue: number; category: string }>();
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const category = categories.find(c => c.id === item.burger.categoryId)?.name || 'Unknown';
        const existing = itemMap.get(item.burger.id) || { 
          name: item.burger.name, 
          quantity: 0, 
          revenue: 0, 
          category 
        };
        existing.quantity += item.quantity;
        existing.revenue += item.totalPrice;
        itemMap.set(item.burger.id, existing);
      });
    });

    const topItems = Array.from(itemMap.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    // Category analytics
    const categoryMap = new Map<string, { name: string; quantity: number; revenue: number; orders: number }>();
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const categoryId = item.burger.categoryId || 'unknown';
        const categoryName = categories.find(c => c.id === categoryId)?.name || 'Uncategorized';
        const existing = categoryMap.get(categoryId) || { 
          name: categoryName, 
          quantity: 0, 
          revenue: 0, 
          orders: 0 
        };
        existing.quantity += item.quantity;
        existing.revenue += item.totalPrice;
        categoryMap.set(categoryId, existing);
      });
    });

    // Count unique orders per category
    const categoryOrdersMap = new Map<string, Set<string>>();
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const categoryId = item.burger.categoryId || 'unknown';
        if (!categoryOrdersMap.has(categoryId)) {
          categoryOrdersMap.set(categoryId, new Set());
        }
        categoryOrdersMap.get(categoryId)!.add(order.id);
      });
    });

    categoryOrdersMap.forEach((orderSet, categoryId) => {
      const existing = categoryMap.get(categoryId);
      if (existing) {
        existing.orders = orderSet.size;
      }
    });

    const topCategories = Array.from(categoryMap.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Time-based analytics
    const hourlyData = new Array(24).fill(0).map((_, hour) => ({ hour, orders: 0, revenue: 0 }));
    const dailyData = new Map<string, { orders: number; revenue: number }>();

    filteredOrders.forEach(order => {
      const date = new Date(order.timestamp);
      const hour = date.getHours();
      const dayKey = date.toISOString().split('T')[0];

      hourlyData[hour].orders += 1;
      hourlyData[hour].revenue += order.totalAmount;

      const existing = dailyData.get(dayKey) || { orders: 0, revenue: 0 };
      existing.orders += 1;
      existing.revenue += order.totalAmount;
      dailyData.set(dayKey, existing);
    });

    const dailyAnalytics = Array.from(dailyData.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Peak hours
    const peakHour = hourlyData.reduce((max, current) => 
      current.orders > max.orders ? current : max
    );

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      completedOrders,
      pendingOrders,
      preparingOrders,
      readyOrders,
      topCustomers,
      topItems,
      topCategories,
      hourlyData,
      dailyAnalytics,
      peakHour
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
      topCustomers: analytics.topCustomers,
      topItems: analytics.topItems,
      topCategories: analytics.topCategories,
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
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'products', label: 'Products', icon: Trophy },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'time', label: 'Time Analysis', icon: Clock },
    { id: 'orders', label: 'Order Details', icon: Eye }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
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

      {/* Filters */}
      <MechanicalCard>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="text-blue-400" />
            <h3 className="text-lg font-bold text-white">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">FROM DATE</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">TO DATE</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)} 
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">CATEGORY</label>
              <select 
                value={selectedCategory} 
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">STATUS</label>
              <select 
                value={selectedStatus} 
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">ORDER TYPE</label>
              <select 
                value={selectedOrderType} 
                onChange={e => setSelectedOrderType(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
              >
                <option value="all">All Types</option>
                <option value="dine-in">Dine In</option>
                <option value="takeaway">Takeaway</option>
              </select>
            </div>
          </div>
        </div>
      </MechanicalCard>

      {/* Query Tabs */}
      <div className="flex flex-wrap gap-2">
        {queryTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveQuery(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeQuery === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Query Content */}
      {activeQuery === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
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
                <div className="text-3xl font-bold text-white mb-2">{analytics.totalOrders}</div>
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

          {/* Status Breakdown */}
          <MechanicalCard>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Order Status Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{analytics.pendingOrders}</div>
                  <div className="text-gray-400">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{analytics.preparingOrders}</div>
                  <div className="text-gray-400">Preparing</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{analytics.readyOrders}</div>
                  <div className="text-gray-400">Ready</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{analytics.completedOrders}</div>
                  <div className="text-gray-400">Completed</div>
                </div>
              </div>
            </div>
          </MechanicalCard>
        </div>
      )}

      {activeQuery === 'customers' && (
        <MechanicalCard>
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Top Customers</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-3 text-gray-400 font-semibold">CUSTOMER</th>
                    <th className="text-left py-3 text-gray-400 font-semibold">PHONE</th>
                    <th className="text-left py-3 text-gray-400 font-semibold">ORDERS</th>
                    <th className="text-left py-3 text-gray-400 font-semibold">TOTAL SPENT</th>
                    <th className="text-left py-3 text-gray-400 font-semibold">AVG ORDER</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topCustomers.map((customer, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-800/50">
                      <td className="py-3 text-white font-medium">{customer.name}</td>
                      <td className="py-3 text-blue-400">{customer.phone}</td>
                      <td className="py-3 text-gray-300">{customer.orders}</td>
                      <td className="py-3 text-green-400 font-bold">${customer.revenue.toFixed(2)}</td>
                      <td className="py-3 text-orange-400">${(customer.revenue / customer.orders).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </MechanicalCard>
      )}

      {activeQuery === 'products' && (
        <MechanicalCard>
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Top Selling Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-3 text-gray-400 font-semibold">PRODUCT</th>
                    <th className="text-left py-3 text-gray-400 font-semibold">CATEGORY</th>
                    <th className="text-left py-3 text-gray-400 font-semibold">QUANTITY SOLD</th>
                    <th className="text-left py-3 text-gray-400 font-semibold">REVENUE</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topItems.map((item, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-800/50">
                      <td className="py-3 text-white font-medium">{item.name}</td>
                      <td className="py-3 text-blue-400">{item.category}</td>
                      <td className="py-3 text-gray-300">{item.quantity}</td>
                      <td className="py-3 text-green-400 font-bold">${item.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </MechanicalCard>
      )}

      {activeQuery === 'categories' && (
        <MechanicalCard>
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Category Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-3 text-gray-400 font-semibold">CATEGORY</th>
                    <th className="text-left py-3 text-gray-400 font-semibold">ORDERS</th>
                    <th className="text-left py-3 text-gray-400 font-semibold">ITEMS SOLD</th>
                    <th className="text-left py-3 text-gray-400 font-semibold">REVENUE</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topCategories.map((category, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-800/50">
                      <td className="py-3 text-white font-medium">{category.name}</td>
                      <td className="py-3 text-blue-400">{category.orders}</td>
                      <td className="py-3 text-gray-300">{category.quantity}</td>
                      <td className="py-3 text-green-400 font-bold">${category.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </MechanicalCard>
      )}

      {activeQuery === 'time' && (
        <div className="space-y-6">
          <MechanicalCard>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Peak Hours Analysis</h3>
              <div className="mb-4 p-4 bg-blue-600/20 rounded border border-blue-500/30">
                <p className="text-blue-300">
                  Peak Hour: {analytics.peakHour.hour}:00 with {analytics.peakHour.orders} orders 
                  (${analytics.peakHour.revenue.toFixed(2)} revenue)
                </p>
              </div>
              <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                {analytics.hourlyData.map((hour, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-gray-400 mb-1">{hour.hour}h</div>
                    <div className={`h-16 rounded flex items-end justify-center text-xs font-bold ${
                      hour.hour === analytics.peakHour.hour ? 'bg-orange-500' : 'bg-gray-700'
                    }`}>
                      <span className="text-white mb-1">{hour.orders}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </MechanicalCard>

          <MechanicalCard>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Daily Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left py-3 text-gray-400 font-semibold">DATE</th>
                      <th className="text-left py-3 text-gray-400 font-semibold">ORDERS</th>
                      <th className="text-left py-3 text-gray-400 font-semibold">REVENUE</th>
                      <th className="text-left py-3 text-gray-400 font-semibold">AVG ORDER</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.dailyAnalytics.slice(-10).map((day, index) => (
                      <tr key={index} className="border-b border-gray-700 hover:bg-gray-800/50">
                        <td className="py-3 text-white">{day.date}</td>
                        <td className="py-3 text-blue-400">{day.orders}</td>
                        <td className="py-3 text-green-400 font-bold">${day.revenue.toFixed(2)}</td>
                        <td className="py-3 text-orange-400">${(day.revenue / day.orders).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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