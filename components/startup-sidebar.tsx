'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Building2, Handshake, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StartupSidebarProps {
  user: {
    name: string
    email: string
    startupName?: string
  }
}

const menuItems = [
  { href: '/startup/partners', label: '파트너사 목록', icon: Building2 },
  { href: '/startup/my-collaborations', label: '내 협업 현황', icon: Handshake },
]

export function StartupSidebar({ user }: StartupSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-lg font-bold text-primary-700">
          한국투자액셀러레이터
        </h1>
        <p className="text-sm text-gray-500">파트너십 혜택</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <div className="mb-3">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-gray-500">{user.startupName}</p>
          <p className="text-xs text-gray-400">{user.email}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          로그아웃
        </button>
      </div>
    </aside>
  )
}
