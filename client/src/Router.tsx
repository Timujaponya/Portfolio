import { Suspense, lazy, useEffect, useState } from 'react';
import App from './App';
import './Router.css';

const AdminPanel = lazy(() => import('./AdminPanel'));

// Environment variable'dan admin path al
const SECRET_ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || '/secret-admin-panel-xyz123';

export const Router = () => {
  const [currentRoute, setCurrentRoute] = useState<'home' | 'admin'>('home');

  // URL'den route'u al
  useEffect(() => {
    const path = window.location.pathname;
    if (path === SECRET_ADMIN_PATH) {
      setCurrentRoute('admin');
    }
  }, []);

  return (
    <div>
      {currentRoute === 'home' ? (
        <App />
      ) : (
        <Suspense fallback={<div style={{ padding: '2rem', color: '#e5e5e5' }}>Yukleniyor...</div>}>
          <AdminPanel />
        </Suspense>
      )}
    </div>
  );
};

export default Router;
