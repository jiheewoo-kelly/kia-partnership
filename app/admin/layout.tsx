import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin-sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/startup/partners')
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar user={session.user} />
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  )
}
