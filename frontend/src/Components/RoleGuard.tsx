import React from 'react';
import { useAuth, type UserRole } from '../Context/AuthContext';
import AccessDenied from './AccessDenied';
import AppLayout from '../Layouts/AppLayout';

export interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  pageTitle?: string;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  wrapInLayout?: boolean;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
  pageTitle = 'Halaman Terlindungi',
  currentPath,
  onNavigate,
  wrapInLayout = true,
}) => {
  const { userRole, isManagerAuthorized } = useAuth();

  // Access is granted if role is in allowed list OR if temporary manager authorization is active
  const isAllowed = allowedRoles.includes(userRole) || (userRole === 'cashier' && isManagerAuthorized);

  if (isAllowed) {
    return <>{children}</>;
  }

  // If cashier tries to view a protected page without PIN authorization, show AccessDenied
  const content = (
    <AccessDenied
      pageTitle={pageTitle}
      onNavigate={onNavigate}
    />
  );

  if (wrapInLayout) {
    return (
      <AppLayout
        title={`Akses Ditolak - ${pageTitle}`}
        currentPath={currentPath}
        onNavigate={onNavigate}
      >
        {content}
      </AppLayout>
    );
  }

  return content;
};

export default RoleGuard;
