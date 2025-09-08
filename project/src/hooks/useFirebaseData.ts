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

    const bootstrap = async () => {
      try {
        // Kick off initial fetches in parallel for faster first paint
        const [initialCategories, initialBurgers, initialCustomizations, initialOrders] = await Promise.all([
          categoriesService.getAll(),
          burgersService.getAll(),
          customizationService.getAll(),
          ordersService.getAll()
        ]);

        setCategories(initialCategories);
        setBurgers(initialBurgers);
        setCustomizations(initialCustomizations);
        setOrders(initialOrders);

        // Then attach real-time listeners
        const unsubscribeCategories = categoriesService.subscribe((data) => setCategories(data));
        unsubscribers.push(unsubscribeCategories);

        const unsubscribeBurgers = burgersService.subscribe((data) => setBurgers(data));
        unsubscribers.push(unsubscribeBurgers);

        const unsubscribeCustomizations = customizationService.subscribe((data) => setCustomizations(data));
        unsubscribers.push(unsubscribeCustomizations);

        const unsubscribeOrders = ordersService.subscribe((data) => setOrders(data));
        unsubscribers.push(unsubscribeOrders);

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    bootstrap();

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