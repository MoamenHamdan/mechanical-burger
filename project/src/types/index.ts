export interface Burger {
  id: string;
  name: string;
  price: number;
  image: string;
  ingredients: string[];
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomizationOption {
  id: string;
  name: string;
  type: 'remove' | 'add' | 'extra';
  price: number;
  categoryId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  burger: Burger;
  customizations: CustomizationOption[];
  quantity: number;
  totalPrice: number;
  comments?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  items: OrderItem[];
  totalAmount: number;
  timestamp: Date;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  estimatedTime: number;
  comments?: string;
  orderType?: 'dine-in' | 'takeaway';
}

export type ViewMode = 'customer' | 'admin';

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  role: 'admin' | 'chef';
  lastLogin: Date;
  isActive: boolean;
}