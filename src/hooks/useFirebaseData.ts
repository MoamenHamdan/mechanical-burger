@@ .. @@
 import { useState, useEffect, useMemo } from 'react';
 import { Burger, Category, CustomizationOption, Order } from '../types';
-import { burgersService, categoriesService, customizationService, ordersService } from '../services/firebaseService';
+import { burgersService, categoriesService, customizationService, ordersService } from '../services/firebaseService';
+import { deletedOrdersService } from '../services/deletedOrdersService';
 
 // Cache for faster loading
 const CACHE_KEY = 'mechanical_burger_cache';
@@ -30,6 +31,7 @@ export const useFirebaseData = () => {
   const [categories, setCategories] = useState<Category[]>([]);
   const [customizations, setCustomizations] = useState<CustomizationOption[]>([]);
   const [orders, setOrders] = useState<Order[]>([]);
+  const [deletedOrders, setDeletedOrders] = useState<Order[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
 
@@ -44,6 +46,7 @@ export const useFirebaseData = () => {
           setBurgers(cachedData.burgers || []);
           setCustomizations(cachedData.customizations || []);
           setOrders(cachedData.orders || []);
+          setDeletedOrders(cachedData.deletedOrders || []);
           setLoading(false);
         }
 
@@ -60,11 +63,12 @@ export const useFirebaseData = () => {
         // Fetch remaining data in background
         Promise.all([
           customizationService.getAll(),
-          ordersService.getAll()
-        ]).then(([initialCustomizations, initialOrders]) => {
+          ordersService.getAll(),
+          deletedOrdersService.getAll()
+        ]).then(([initialCustomizations, initialOrders, initialDeletedOrders]) => {
           setCustomizations(initialCustomizations);
           setOrders(initialOrders);
+          setDeletedOrders(initialDeletedOrders);
         });
 
         // Cache the essential data
@@ -72,7 +76,8 @@ export const useFirebaseData = () => {
           categories: initialCategories,
           burgers: initialBurgers,
           customizations: cachedData?.customizations || [],
-          orders: cachedData?.orders || []
+          orders: cachedData?.orders || [],
+          deletedOrders: cachedData?.deletedOrders || []
         });
 
         // Attach real-time listeners
@@ -87,6 +92,9 @@ export const useFirebaseData = () => {
         const unsubscribeOrders = ordersService.subscribe((data) => setOrders(data));
         unsubscribers.push(unsubscribeOrders);
 
+        const unsubscribeDeletedOrders = deletedOrdersService.subscribe((data) => setDeletedOrders(data));
+        unsubscribers.push(unsubscribeDeletedOrders);
+
         setLoading(false);
       } catch (err) {
         setError(err instanceof Error ? err.message : 'An error occurred');
@@ -104,6 +112,7 @@ export const useFirebaseData = () => {
     categories,
     customizations,
     orders,
+    deletedOrders,
     loading,
     error
-  }), [burgers, categories, customizations, orders, loading, error]);
+  }), [burgers, categories, customizations, orders, deletedOrders, loading, error]);
 };