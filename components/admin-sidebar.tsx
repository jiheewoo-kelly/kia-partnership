'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Building2,
  FolderTree,
  Rocket,
  Handshake,
  Star,
  FileBarChart,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminSidebarProps {
  user: {
    name: string
    email: string
  }
}

const menuItems = [
  { href: '/admin/dashboard', label: '대시보드', icon: LayoutDashboard },
  { href: '/admin/categories', label: '카테고리 관리', icon: FolderTree },
  { href: '/admin/partners', label: '파트너사 관리', icon: Building2 },
  { href: '/admin/startups', label: '스타트업 관리', icon: Rocket },
  { href: '/admin/collaborations', label: '협업 현황', icon: Handshake },
  { href: '/admin/reviews', label: '리뷰 관리', icon: Star },
  { href: '/admin/reports', label: 'Impact Report', icon: FileBarChart },
]

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-lg font-bold text-primary-700">
          한국투자액셀러레이터
        </h1>
        <p className="text-sm text-gray-500">파트너십 관리</p>
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
          <p className="text-xs text-gray-500">{user.email}</p>
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
