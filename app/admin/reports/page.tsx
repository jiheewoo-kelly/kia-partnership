'use client'

import { useState, useEffect } from 'react'
import { Download, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, getStatusLabel } from '@/lib/utils'
import * as XLSX from 'xlsx'

interface ReportData {
  period: { startDate: string; endDate: string }
  summary: {
    totalCollaborations: number
    completedCollaborations: number
    totalEstimatedSaving: number
    totalActualSaving: number
    avgRating: number
    reviewCount: number
  }
  serviceTypeBreakdown: {
    selfService: number
    approvalRequired: number
  }
  categoryBreakdown: { name: string; count: number }[]
  startupBreakdown: { name: string; count: number; saving: number }[]
  collaborations: {
    id: string
    startup: string
    partner: string
    category: string
    status: string
    estimatedSaving: number | null
    actualSaving: number | null
    rating: number | null
    createdAt: string
  }[]
}

export default function ReportsPage() {
  const [report, setReport] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const fetchReport = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const res = await fetch(`/api/reports?${params}`)
      const data = await res.json()
      setReport(data)
    } catch (error) {
      console.error('Failed to fetch report:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [])

  const exportToExcel = () => {
    if (!report) return

    const wb = XLSX.utils.book_new()

    // Summary sheet
    const summaryData = [
      ['Impact Report'],
      ['기간', `${report.period.startDate} ~ ${report.period.endDate}`],
      [],
      ['총 협업 건수', report.summary.totalCollaborations],
      ['완료된 협업', report.summary.completedCollaborations],
      ['추정 절감 비용', report.summary.totalEstimatedSaving],
      ['실제 절감 비용', report.summary.totalActualSaving],
      ['평균 만족도', report.summary.avgRating],
      ['리뷰 수', report.summary.reviewCount],
    ]
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(wb, summarySheet, '요약')

    // Collaborations sheet
    const collabData = [
      ['스타트업', '파트너사', '카테고리', '상태', '추정 절감', '실제 절감', '평점', '요청일'],
      ...report.collaborations.map((c) => [
        c.startup,
        c.partner,
        c.category,
        getStatusLabel(c.status),
        c.estimatedSaving || '',
        c.actualSaving || '',
        c.rating || '',
        new Date(c.createdAt).toLocaleDateString('ko-KR'),
      ]),
    ]
    const collabSheet = XLSX.utils.aoa_to_sheet(collabData)
    XLSX.utils.book_append_sheet(wb, collabSheet, '협업 내역')

    // Category breakdown sheet
    const categoryData = [
      ['카테고리', '협업 수'],
      ...report.categoryBreakdown.map((c) => [c.name, c.count]),
    ]
    const categorySheet = XLSX.utils.aoa_to_sheet(categoryData)
    XLSX.utils.book_append_sheet(wb, categorySheet, '카테고리별')

    // Startup breakdown sheet
    const startupData = [
      ['스타트업', '협업 수', '절감 비용'],
      ...report.startupBreakdown.map((s) => [s.name, s.count, s.saving]),
    ]
    const startupSheet = XLSX.utils.aoa_to_sheet(startupData)
    XLSX.utils.book_append_sheet(wb, startupSheet, '스타트업별')

    // Download
    const fileName = `impact_report_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, fileName)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Impact Report</h1>
          <p className="text-gray-500">파트너십 성과를 분석합니다</p>
        </div>
        <Button onClick={exportToExcel} disabled={!report}>
          <Download className="h-4 w-4 mr-2" />
          Excel 다운로드
        </Button>
      </div>

      {/* Date Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-end gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-40"
              />
              <span>~</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-40"
              />
            </div>
            <Button onClick={fetchReport} disabled={loading}>
              {loading ? '조회 중...' : '조회'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setStartDate('')
                setEndDate('')
                fetchReport()
              }}
            >
              전체 기간
            </Button>
          </div>
        </CardContent>
      </Card>

      {report && (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">총 협업</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {report.summary.totalCollaborations}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">완료</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {report.summary.completedCollaborations}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">셀프서비스</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {report.serviceTypeBreakdown.selfService}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">승인필요</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {report.serviceTypeBreakdown.approvalRequired}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">추정 절감</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-blue-600">
                  {formatCurrency(report.summary.totalEstimatedSaving)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">실제 절감</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-green-600">
                  {formatCurrency(report.summary.totalActualSaving)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Breakdowns */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>카테고리별 이용 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {report.categoryBreakdown.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <span>{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 bg-primary-500 rounded"
                          style={{
                            width: `${(cat.count / report.summary.totalCollaborations) * 100}px`,
                          }}
                        />
                        <span className="text-sm text-gray-500">{cat.count}건</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>스타트업별 활용 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>스타트업</TableHead>
                      <TableHead className="text-right">협업 수</TableHead>
                      <TableHead className="text-right">절감 비용</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.startupBreakdown.slice(0, 5).map((startup) => (
                      <TableRow key={startup.name}>
                        <TableCell>{startup.name}</TableCell>
                        <TableCell className="text-right">{startup.count}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(startup.saving)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Full Collaboration List */}
          <Card>
            <CardHeader>
              <CardTitle>협업 상세 내역</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>스타트업</TableHead>
                    <TableHead>파트너사</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-right">추정 절감</TableHead>
                    <TableHead className="text-right">실제 절감</TableHead>
                    <TableHead className="text-right">평점</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.collaborations.map((collab) => (
                    <TableRow key={collab.id}>
                      <TableCell>{collab.startup}</TableCell>
                      <TableCell>{collab.partner}</TableCell>
                      <TableCell>{collab.category}</TableCell>
                      <TableCell>{getStatusLabel(collab.status)}</TableCell>
                      <TableCell className="text-right">
                        {collab.estimatedSaving ? formatCurrency(collab.estimatedSaving) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {collab.actualSaving ? formatCurrency(collab.actualSaving) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {collab.rating ? `${collab.rating}/5` : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
