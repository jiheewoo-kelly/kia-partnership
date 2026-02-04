import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { StartupSidebar } from '@/components/startup-sidebar'

export default async function StartupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'STARTUP') {
    redirect('/admin/dashboard')
  }

  return (
    <div className="flex min-h-screen">
      <StartupSidebar user={session.user} />
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  )
}
