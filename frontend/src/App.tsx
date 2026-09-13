import { useState, useEffect } from 'react';
import { api } from './api';
import { SessionGate } from './SessionGate';
import Dashboard from './Pages/Dashboard/Index';
import Inventory from './Pages/Inventory/Index';
import Pos from './Pages/Pos/Index';
import Reports from './Pages/Reports/Index';
import ResetPassword from './Pages/Auth/ResetPassword';
import Register from './Pages/Auth/Register';

function RoutedApp() {
  // Read path from window.location.pathname or fallback to '/'
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      return path && path !== '' ? path : '/';
    }
    return '/';
  });

  // Keep path synced with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Programmatic navigation handler
  const navigate = (path: string) => {
    if (path === '/login') {
      void api('/logout', {method: 'POST'}).finally(() => {
        sessionStorage.removeItem('nexa_token');
        localStorage.removeItem('nexa_token');
        window.dispatchEvent(new Event('nexa:logout'));
      });
      return;
    }
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route resolver
  const renderRoute = () => {
    switch (currentPath) {
      case '/inventory':
        return <Inventory onNavigate={(path) => navigate(path)} />;
      case '/pos':
        return <Pos onNavigate={(path) => navigate(path)} />;
      case '/reports':
        return <Reports onNavigate={(path) => navigate(path)} />;
      case '/':
      case '/dashboard':
      default:
        return <Dashboard onNavigate={(path) => navigate(path)} />;
    }
  };

  return (
    <div className="w-full h-full max-h-screen overflow-hidden bg-slate-100 flex flex-col justify-start">
      {renderRoute()}
    </div>
  );
}

export function App() {
  if (window.location.pathname === '/reset-password') {
    return <ResetPassword />;
  }
  if (window.location.pathname === '/register') {
    return <Register />;
  }

  return <SessionGate><RoutedApp /></SessionGate>;
}
export default App;
