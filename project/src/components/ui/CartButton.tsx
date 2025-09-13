import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { OrderItem } from '../../types';

interface CartButtonProps {
  items: OrderItem[];
  onClick: () => void;
}

export const CartButton: React.FC<CartButtonProps> = ({ items, onClick }) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <button
      onClick={onClick}
      className="relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 text-gray-300 hover:text-white hover:bg-gray-700"
    >
      <div className="relative">
        <ShoppingCart size={20} />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {totalItems}
          </span>
        )}
      </div>
      <div className="hidden sm:flex flex-col items-start">
        <span className="text-xs">Cart</span>
        {totalItems > 0 && (
          <span className="text-xs text-orange-400 font-bold">${totalPrice.toFixed(2)}</span>
        )}
      </div>
    </button>
  );
};