import type { ReactNode } from 'react'
import MerchantShell from '../../Components/dashboard/MerchantShell'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <MerchantShell>{children}</MerchantShell>
}
