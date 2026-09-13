import React, { createContext, useContext, useState, type ReactNode } from 'react';

export type UserRole = 'owner' | 'cashier';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  initials: string;
  storeName: string;
  avatarBg: string;
  avatarText: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

export interface AccessLog {
  id: string;
  userName: string;
  pageAccessed: string;
  timestamp: string;
  status: 'Granted' | 'Denied';
}

export const USERS: Record<UserRole, UserProfile> = {
  owner: {
    id: 'usr_owner_1',
    name: 'Juragan Budi',
    role: 'owner',
    roleLabel: 'Owner',
    initials: 'JB',
    storeName: 'Warung Berkah Jaya',
    avatarBg: 'bg-emerald-100',
    avatarText: 'text-[#057A55]',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-[#057A55]',
    description: 'Akses penuh ke semua modul, laporan keuangan & pengaturan toko.',
  },
  cashier: {
    id: 'usr_cashier_1',
    name: 'Kasir Siti',
    role: 'cashier',
    roleLabel: 'Kasir',
    initials: 'KS',
    storeName: 'Warung Berkah Jaya',
    avatarBg: 'bg-indigo-100',
    avatarText: 'text-indigo-700',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-700',
    description: 'Akses kasir POS dan inventaris stok (read-only). Memerlukan PIN Owner untuk akses sementara ke modul sensitif.',
  },
};

export const OWNER_PINS = ['123456', '1234'];

const INITIAL_ACCESS_LOGS: AccessLog[] = [
  {
    id: 'log-101',
    userName: 'Kasir Siti',
    pageAccessed: 'Laporan Keuangan',
    timestamp: 'Hari ini, 08:42 WIB',
    status: 'Granted',
  },
  {
    id: 'log-102',
    userName: 'Kasir Budi',
    pageAccessed: 'Pengaturan Toko',
    timestamp: 'Hari ini, 08:15 WIB',
    status: 'Denied',
  },
  {
    id: 'log-103',
    userName: 'Kasir Siti',
    pageAccessed: 'Pengaturan Toko',
    timestamp: 'Kemarin, 16:50 WIB',
    status: 'Granted',
  },
  {
    id: 'log-104',
    userName: 'Kasir Agus',
    pageAccessed: 'Laporan Keuangan',
    timestamp: 'Kemarin, 14:10 WIB',
    status: 'Denied',
  },
  {
    id: 'log-105',
    userName: 'Kasir Siti',
    pageAccessed: 'Laporan Keuangan',
    timestamp: '11 Sep 2026, 10:25 WIB',
    status: 'Granted',
  },
];

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AuthContextType {
  userRole: UserRole;
  currentUser: UserProfile;
  isOwner: boolean;
  isCashier: boolean;
  isManagerAuthorized: boolean;
  setManagerAuthorized: (authorized: boolean) => void;
  revokeManagerAuthorization: () => void;
  setUserRole: (role: UserRole) => void;
  switchRole: (role: UserRole) => void;
  verifyPin: (pin: string, pageAccessed?: string) => boolean;
  isPinModalOpen: boolean;
  openPinModal: (onSuccess?: () => void, targetPage?: string) => void;
  closePinModal: () => void;
  pinCallback: (() => void) | null;
  currentPinTargetPage: string;
  accessLogs: AccessLog[];
  addAccessLog: (entry: Omit<AccessLog, 'id' | 'timestamp'> & { timestamp?: string }) => void;
  clearAccessLogs: () => void;
  toast: ToastNotification | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'warungpintar_user_role';
const LOGS_STORAGE_KEY = 'warungpintar_access_logs';

export const getFormattedCurrentTime = (): string => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `Hari ini, ${hours}:${minutes} WIB`;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as UserRole;
      if (saved === 'owner' || saved === 'cashier') {
        return saved;
      }
    }
    return 'owner';
  });

  // Temporary Manager Authorization state
  const [isManagerAuthorized, setIsManagerAuthorized] = useState<boolean>(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinCallback, setPinCallback] = useState<(() => void) | null>(null);
  const [currentPinTargetPage, setCurrentPinTargetPage] = useState<string>('Laporan Keuangan');
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Audit access logs
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>(() => {
    if (typeof window !== 'undefined') {
      const savedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
      if (savedLogs) {
        try {
          return JSON.parse(savedLogs);
        } catch {
          // fallback to defaults
        }
      }
    }
    return INITIAL_ACCESS_LOGS;
  });

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3500);
  };

  const addAccessLog = (entry: Omit<AccessLog, 'id' | 'timestamp'> & { timestamp?: string }) => {
    const newLog: AccessLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userName: entry.userName || currentUser.name,
      pageAccessed: entry.pageAccessed || 'Modul Terlindungi',
      timestamp: entry.timestamp || getFormattedCurrentTime(),
      status: entry.status,
    };

    setAccessLogs((prev) => {
      const updated = [newLog, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const clearAccessLogs = () => {
    setAccessLogs([]);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify([]));
    }
    showToast('Riwayat audit log berhasil dibersihkan', 'info');
  };

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    setIsManagerAuthorized(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, role);
    }
  };

  const switchRole = (role: UserRole) => {
    setUserRole(role);
    if (role === 'cashier') {
      showToast('Beralih ke mode Kasir Siti (Akses Terbatas)', 'info');
    } else {
      showToast('Beralih ke mode Juragan Budi (Owner)', 'success');
    }
  };

  const revokeManagerAuthorization = () => {
    if (isManagerAuthorized) {
      setIsManagerAuthorized(false);
      showToast('Otorisasi Owner ditutup otomatis (Kembali Terkunci)', 'info');
    }
  };

  const setManagerAuthorized = (authorized: boolean) => {
    setIsManagerAuthorized(authorized);
  };

  /**
   * Validates the Owner PIN and records audit log
   */
  const verifyPin = (pin: string, pageAccessed?: string): boolean => {
    const cleanedPin = pin.trim();
    const target = pageAccessed || currentPinTargetPage || 'Laporan Keuangan';
    const isSuccess = OWNER_PINS.includes(cleanedPin);

    // Record audit log entry
    addAccessLog({
      userName: currentUser.name,
      pageAccessed: target,
      status: isSuccess ? 'Granted' : 'Denied',
      timestamp: getFormattedCurrentTime(),
    });

    if (isSuccess) {
      setIsManagerAuthorized(true);
      showToast('Akses Sementara Diberikan', 'success');
      return true;
    }

    return false;
  };

  const openPinModal = (onSuccess?: () => void, targetPage?: string) => {
    if (onSuccess) {
      setPinCallback(() => onSuccess);
    } else {
      setPinCallback(null);
    }
    if (targetPage) {
      setCurrentPinTargetPage(targetPage);
    } else if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/settings')) {
        setCurrentPinTargetPage('Pengaturan Toko');
      } else if (path.startsWith('/reports')) {
        setCurrentPinTargetPage('Laporan Keuangan');
      } else if (path.startsWith('/inventory')) {
        setCurrentPinTargetPage('Inventaris Stok');
      } else {
        setCurrentPinTargetPage('Modul Terlindungi');
      }
    }
    setIsPinModalOpen(true);
  };

  const closePinModal = () => {
    setIsPinModalOpen(false);
    setPinCallback(null);
  };

  const currentUser = USERS[userRole];
  const isOwner = userRole === 'owner';
  const isCashier = userRole === 'cashier';

  return (
    <AuthContext.Provider
      value={{
        userRole,
        currentUser,
        isOwner,
        isCashier,
        isManagerAuthorized,
        setManagerAuthorized,
        revokeManagerAuthorization,
        setUserRole,
        switchRole,
        verifyPin,
        isPinModalOpen,
        openPinModal,
        closePinModal,
        pinCallback,
        currentPinTargetPage,
        accessLogs,
        addAccessLog,
        clearAccessLogs,
        toast,
        showToast,
      }}
    >
      {children}

      {/* Global Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 right-5 z-[250] pointer-events-none animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2.5 backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-[#057A55] text-white border-emerald-400/30 shadow-emerald-950/20'
                : toast.type === 'info'
                ? 'bg-slate-900 text-white border-slate-700 shadow-slate-950/30'
                : toast.type === 'warning'
                ? 'bg-amber-500 text-white border-amber-400 shadow-amber-950/20'
                : 'bg-rose-600 text-white border-rose-400 shadow-rose-950/20'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
