import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Fleet Logistics Controller',
  description: 'Sistema Formal de Gestión Logística de Flotas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <div className="layout">
          <aside className="sidebar">
            <h2>Fleet Control</h2>
            <Navigation />
          </aside>
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
