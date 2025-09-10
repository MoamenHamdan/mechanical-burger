import { Burger, CustomizationOption } from '../types';

export const burgers: Burger[] = [
  {
    id: '1',
    name: 'Turbo Charge',
    price: 18.99,
    image: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400',
    ingredients: ['Angus beef patty', 'Turbo sauce', 'Nitrous pickles', 'Racing cheese', 'Speed lettuce'],
    categoryId: 'signature',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Engine Block',
    price: 24.99,
    image: 'https://images.pexels.com/photos/1556698/pexels-photo-1556698.jpeg?auto=compress&cs=tinysrgb&w=400',
    ingredients: ['Double beef patties', 'Motor oil glaze', 'Piston rings onions', 'Carburetor cheese'],
    categoryId: 'signature',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Gear Shift',
    price: 16.99,
    image: 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=400',
    ingredients: ['Grilled chicken breast', 'Transmission sauce', 'Clutch lettuce', 'Gear cheese'],
    categoryId: 'classic',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Exhaust Pipe',
    price: 19.99,
    image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400',
    ingredients: ['BBQ beef patty', 'Exhaust sauce', 'Smoke rings onions', 'Chrome cheese'],
    categoryId: 'specialty',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    name: 'Brake Fluid',
    price: 17.99,
    image: 'https://images.pexels.com/photos/1841834/pexels-photo-1841834.jpeg?auto=compress&cs=tinysrgb&w=400',
    ingredients: ['Spicy beef patty', 'Brake fluid sauce', 'Jalapeño discs', 'High-friction cheese'],
    categoryId: 'specialty',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    name: 'Classic Carburetor',
    price: 14.99,
    image: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=400',
    ingredients: ['Classic beef patty', 'Carburetor sauce', 'Vintage lettuce', 'Old-school cheese'],
    categoryId: 'classic',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const customizationOptions: CustomizationOption[] = [
  { 
    id: 'remove-pickles', 
    name: 'Remove Pickles', 
    type: 'remove', 
    price: 0, 
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'remove-onions', 
    name: 'Remove Onions', 
    type: 'remove', 
    price: 0, 
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'remove-cheese', 
    name: 'Remove Cheese', 
    type: 'remove', 
    price: 0, 
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'extra-cheese', 
    name: 'Extra Cheese', 
    type: 'extra', 
    price: 2.50, 
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'extra-bacon', 
    name: 'Turbo Bacon', 
    type: 'add', 
    price: 3.50, 
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'extra-patty', 
    name: 'Double Engine Patty', 
    type: 'add', 
    price: 5.99, 
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'spicy-sauce', 
    name: 'Nitrous Spice Sauce', 
    type: 'add', 
    price: 1.50, 
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'premium-bun', 
    name: 'Carbon Fiber Bun', 
    type: 'add', 
    price: 2.00, 
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];