import React from 'react';
import { TrendingUp, DollarSign, Clock, Users } from 'lucide-react';
import { Order } from '../../types';
import { MechanicalCard } from '../ui/MechanicalCard';
import { useLanguage } from '../../hooks/useLanguage';

interface OrderAnalyticsProps {
  orders: Order[];
}

export const OrderAnalytics: React.FC<OrderAnalyticsProps> = ({ orders }) => {
  const { t } = useLanguage();
  
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const averageWaitTime = orders.length > 0 
    ? orders.reduce((sum, order) => sum + order.estimatedTime, 0) / orders.length 
    : 0;

  const recentOrders = orders
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">ANALYTICS DASHBOARD</h2>
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
                    <td className="py-4 text-gray-300">{order.items.length} item(s)</td>
                    <td className="py-4 text-orange-400 font-bold">${order.totalAmount.toFixed(2)}</td>
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
                      {new Date(order.timestamp).toLocaleTimeString()}
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
    </div>
  );
};