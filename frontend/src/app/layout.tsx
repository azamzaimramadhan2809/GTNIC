import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '../index.css'
import { StoreProvider } from '../Context/StoreContext'

export const metadata: Metadata = {
  title: 'NexaSmart',
  description: 'Etalase digital dan pengelolaan toko untuk UMKM Indonesia.',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}
