import { useState, useEffect } from 'react';
import { Burger, Category, CustomizationOption, Order } from '../types';
import { burgersService, categoriesService, customizationService, ordersService } from '../services/firebaseService';

export const useFirebaseData = () => {
  const [burgers, setBurgers] = useState<Burger[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [customizations, setCustomizations] = useState<CustomizationOption[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    try {
      // Subscribe to categories
      const unsubscribeCategories = categoriesService.subscribe((data) => {
        setCategories(data);
      });
      unsubscribers.push(unsubscribeCategories);

      // Subscribe to burgers
      const unsubscribeBurgers = burgersService.subscribe((data) => {
        setBurgers(data);
      });
      unsubscribers.push(unsubscribeBurgers);

      // Subscribe to customizations
      const unsubscribeCustomizations = customizationService.subscribe((data) => {
        setCustomizations(data);
      });
      unsubscribers.push(unsubscribeCustomizations);

      // Subscribe to orders
      const unsubscribeOrders = ordersService.subscribe((data) => {
        setOrders(data);
      });
      unsubscribers.push(unsubscribeOrders);

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  return {
    burgers,
    categories,
    customizations,
    orders,
    loading,
    error
  };
};