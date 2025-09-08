import { useState, useEffect } from 'react';
import { Burger, Category, CustomizationOption, Order } from '../types';
import { burgersService, categoriesService, customizationService, ordersService } from '../services/firebaseService';

// Cache for faster loading
const CACHE_KEY = 'mechanical_burger_cache';
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes (reduced for faster updates)

const getCachedData = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
  } catch (e) {
    // Ignore cache errors
  }
  return null;
};

const setCachedData = (data: any) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (e) {
    // Ignore cache errors
  }
};

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
        // Check cache first for instant loading
        const cachedData = getCachedData();
        if (cachedData) {
          setCategories(cachedData.categories || []);
          setBurgers(cachedData.burgers || []);
          setCustomizations(cachedData.customizations || []);
          setOrders(cachedData.orders || []);
          setLoading(false);
        }

        // Fetch only essential data first (burgers and categories)
        const [initialCategories, initialBurgers] = await Promise.all([
          categoriesService.getAll(),
          burgersService.getAll()
        ]);

        // Update essential data immediately
        setCategories(initialCategories);
        setBurgers(initialBurgers);

        // Fetch remaining data in background
        Promise.all([
          customizationService.getAll(),
          ordersService.getAll()
        ]).then(([initialCustomizations, initialOrders]) => {
          setCustomizations(initialCustomizations);
          setOrders(initialOrders);
        });

        // Cache the essential data
        setCachedData({
          categories: initialCategories,
          burgers: initialBurgers,
          customizations: cachedData?.customizations || [],
          orders: cachedData?.orders || []
        });

        // Attach real-time listeners
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