import { useState, useEffect } from 'react';
import Login from './Pages/Auth/Login';
import Dashboard from './Pages/Dashboard/Index';
import Inventory from './Pages/Inventory/Index';
import Pos from './Pages/Pos/Index';
import Customers from './Pages/Customers/Index';
import Reports from './Pages/Reports/Index';
import Settings from './Pages/Settings/Index';
import { AuthProvider, useAuth } from './Context/AuthContext';
import RoleGuard from './Components/RoleGuard';

function AppContent() {
  const { isCashier, isManagerAuthorized, revokeManagerAuthorization } = useAuth();

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

  // AUTO-LOCK ON NAVIGATION EXIT:
  // When Cashier leaves sensitive manager pages (/reports, /settings) and returns to POS, Beranda, etc.,
  // automatically revoke temporary manager authorization so returning later requires PIN again.
  useEffect(() => {
    const isProtectedPage = currentPath.startsWith('/reports') || currentPath.startsWith('/settings');
    if (!isProtectedPage && isCashier && isManagerAuthorized) {
      revokeManagerAuthorization();
    }
  }, [currentPath, isCashier, isManagerAuthorized, revokeManagerAuthorization]);

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
      case '/customers':
        return <Customers onNavigate={(path) => navigate(path)} />;
      case '/reports':
        return (
          <RoleGuard
            allowedRoles={['owner']}
            pageTitle="Laporan Keuangan"
            currentPath={currentPath}
            onNavigate={(path) => navigate(path)}
          >
            <Reports onNavigate={(path) => navigate(path)} />
          </RoleGuard>
        );
      case '/settings':
        return (
          <RoleGuard
            allowedRoles={['owner']}
            pageTitle="Pengaturan Toko"
            currentPath={currentPath}
            onNavigate={(path) => navigate(path)}
          >
            <Settings onNavigate={(path) => navigate(path)} />
          </RoleGuard>
        );
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
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
