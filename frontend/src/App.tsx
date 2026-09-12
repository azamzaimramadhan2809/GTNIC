import { useState, useEffect } from 'react';
import Login from './Pages/Auth/Login';
import Dashboard from './Pages/Dashboard/Index';
import Inventory from './Pages/Inventory/Index';
import Pos from './Pages/Pos/Index';
import Reports from './Pages/Reports/Index';

export function App() {
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
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route resolver
  const renderRoute = () => {
    switch (currentPath) {
      case '/login':
        return (
          <Login
            onLoginSuccess={() => navigate('/')}
            onNavigate={(path) => navigate(path)}
          />
        );
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

export default App;
