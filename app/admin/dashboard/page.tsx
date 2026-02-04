import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Rocket, Handshake, Star } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function AdminDashboard() {
  // Fetch data from Supabase
  const [
    { data: partners },
    { data: startups },
    { data: collaborations },
    { data: reviews },
  ] = await Promise.all([
    supabase.from('partners').select('*'),
    supabase.from('startups').select('*'),
    supabase.from('collaborations').select('*, startup:startups(*), partner:partners(*)'),
    supabase.from('reviews').select('*'),
  ])

  // Calculate stats
  const partnersCount = partners?.filter(p => p.is_active).length || 0
  const startupsCount = startups?.length || 0
  const collaborationsCount = collaborations?.length || 0
  const completedCollaborations = collaborations?.filter(c => c.status === 'COMPLETED').length || 0
  const pendingRequests = collaborations?.filter(c => c.status === 'PENDING').length || 0

  const avgRating = reviews && reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  const recentCollaborations = collaborations
    ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5) || []

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: '대기중',
      IN_PROGRESS: '진행중',
      COMPLETED: '완료',
      CANCELLED: '취소됨',
    }
    return labels[status] || status
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-gray-500">파트너십 현황을 한눈에 확인하세요</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 파트너사</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partnersCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">포트폴리오사</CardTitle>
            <Rocket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{startupsCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 협업</CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collaborationsCount}</div>
            <p className="text-xs text-muted-foreground">
              완료 {completedCollaborations} / 대기 {pendingRequests}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 만족도</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating} / 5.0</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>협업 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {collaborationsCount}건
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              진행중 {collaborations?.filter(c => c.status === 'IN_PROGRESS').length || 0}건
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>최근 협업 요청</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCollaborations.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  아직 협업 요청이 없습니다
                </p>
              ) : (
                recentCollaborations.map((collab) => (
                  <div
                    key={collab.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      <span className="font-medium">{collab.startup?.name || 'Unknown'}</span>
                      <span className="text-muted-foreground"> → </span>
                      <span>{collab.partner?.name || 'Unknown'}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {getStatusLabel(collab.status)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
