import { Suspense, lazy, useEffect, useState } from 'react';
import App from './App';
import './Router.css';
import ServiceDetailPage from './pages/ServiceDetailPage';

const AdminPanel = lazy(() => import('./AdminPanel'));

// Environment variable'dan admin path al
const SECRET_ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || '/secret-admin-panel-xyz123';

export const Router = () => {
  const [currentRoute, setCurrentRoute] = useState<'home' | 'admin' | 'service'>('home');
  const [serviceId, setServiceId] = useState<string | null>(null);

  // URL'den route'u al
  useEffect(() => {
    const parseRoute = () => {
      const path = window.location.pathname.replace(/\/+$/, '') || '/';

      if (path === SECRET_ADMIN_PATH) {
        setCurrentRoute('admin');
        setServiceId(null);
        return;
      }

      const serviceMatch = path.match(/^\/services\/([^/]+)$/);
      if (serviceMatch) {
        setCurrentRoute('service');
        setServiceId(decodeURIComponent(serviceMatch[1]));
        return;
      }

      setCurrentRoute('home');
      setServiceId(null);
    };

    parseRoute();
    window.addEventListener('popstate', parseRoute);

    return () => {
      window.removeEventListener('popstate', parseRoute);
    };
  }, []);

  return (
    <div>
      {currentRoute === 'home' ? (
        <App />
      ) : currentRoute === 'service' && serviceId ? (
        <ServiceDetailPage serviceId={serviceId} />
      ) : (
        <Suspense fallback={<div style={{ padding: '2rem', color: '#e5e5e5' }}>Yukleniyor...</div>}>
          <AdminPanel />
        </Suspense>
      )}
    </div>
  );
};

export default Router;
