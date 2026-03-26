'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav>
      <Link href="/" className={pathname === '/' ? 'active' : ''}>
        Dashboard (Viajes)
      </Link>
      <Link href="/vehicles" className={pathname === '/vehicles' ? 'active' : ''}>
        Vehículos
      </Link>
      <Link href="/drivers" className={pathname === '/drivers' ? 'active' : ''}>
        Conductores
      </Link>
    </nav>
  )
}
