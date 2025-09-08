import React, { useEffect, useState } from 'react';
import { ViewMode } from './types';
import { Header } from './components/Header';
import { CustomerView } from './components/customer/CustomerView';
import { AdminView } from './components/admin/AdminView';
import { AdminAuthGate } from './components/admin/AdminAuthGate';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { useFirebaseData } from './hooks/useFirebaseData';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('customer');
  const [adminAuthed, setAdminAuthed] = useState<boolean>(false);
  const { burgers, categories, customizations, orders, loading, error } = useFirebaseData();
  
  // Secret URL-based admin access: e.g., https://site/#admin-<token>
  useEffect(() => {
    const sessionAuthed = sessionStorage.getItem('admin_authed') === 'true';
    if (sessionAuthed) setAdminAuthed(true);

    const checkHash = () => {
      const hash = window.location.hash || '';
      const token = import.meta.env.VITE_ADMIN_HASH;
      const expectedHash = `#admin-${token}`;
      const allowed = token && hash === expectedHash;
      
      console.log('Debug admin access:');
      console.log('- Current hash:', hash);
      console.log('- Token from env:', token);
      console.log('- Expected hash:', expectedHash);
      console.log('- Access allowed:', allowed);
      
      if (allowed) setCurrentView('admin'); else setCurrentView('customer');
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  if (loading) {
    return <LoadingSpinner message="Initializing Mechanical Systems..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">System Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
          >
            Restart System
          </button>
        </div>
      </div>
    );
  }

  const handleOrderComplete = (order: any) => {
    // Order is already saved to Firebase in the CustomizationModal
    console.log('Order completed:', order);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'customer':
        return (
          <CustomerView 
            burgers={burgers}
            categories={categories}
            customizations={customizations}
            onOrderComplete={handleOrderComplete}
          />
        );
      case 'admin':
        if (!adminAuthed) {
          return (
            <AdminAuthGate onAuthenticated={() => setAdminAuthed(true)} />
          );
        }
        return (
          <AdminView
            burgers={burgers}
            categories={categories}
            customizations={customizations}
            orders={orders}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      {renderCurrentView()}
    </div>
  );
}

export default App;