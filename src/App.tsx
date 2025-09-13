@@ .. @@
 import React, { useEffect, useState } from 'react';
 import { ViewMode } from './types';
+import { OrderItem } from './types';
 import { Header } from './components/Header';
 import { CustomerView } from './components/customer/CustomerView';
 import { AdminView } from './components/admin/AdminView';
 import { AdminAuthGate } from './components/admin/AdminAuthGate';
 import { LoadingSpinner } from './components/ui/LoadingSpinner';
 import { useFirebaseData } from './hooks/useFirebaseData';
 
 function App() {
   const [currentView, setCurrentView] = useState<ViewMode>('customer');
   const [adminAuthed, setAdminAuthed] = useState<boolean>(false);
-  const { burgers, categories, customizations, orders, loading, error } = useFirebaseData();
+  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
+  const [showCart, setShowCart] = useState(false);
+  const { burgers, categories, customizations, orders, deletedOrders, loading, error } = useFirebaseData();
   
   // Secret URL-based admin access: e.g., https://site/#admin-<token>
   useEffect(() => {
@@ -50,6 +53,10 @@ function App() {
     console.log('Order completed:', order);
   };
 
+  const handleCartToggle = () => {
+    setShowCart(!showCart);
+  };
+
   const renderCurrentView = () => {
     switch (currentView) {
       case 'customer':
@@ -58,6 +65,10 @@ function App() {
             burgers={burgers}
             categories={categories}
             customizations={customizations}
+            cartItems={cartItems}
+            onUpdateCart={setCartItems}
+            showCart={showCart}
+            onCartToggle={handleCartToggle}
             onOrderComplete={handleOrderComplete}
           />
         );
@@ -73,6 +84,7 @@ function App() {
             categories={categories}
             customizations={customizations}
             orders={orders}
+            deletedOrders={deletedOrders}
           />
         );
     }
@@ -81,7 +93,12 @@ function App() {
   return (
     <div className="min-h-screen bg-gray-900">
-      <Header currentView={currentView} onViewChange={setCurrentView} />
+      <Header 
+        currentView={currentView} 
+        onViewChange={setCurrentView}
+        cartItems={cartItems}
+        onCartClick={handleCartToggle}
+      />
       {renderCurrentView()}
     </div>
   );