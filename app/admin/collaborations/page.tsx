'use client'

import { useState, useEffect } from 'react'
import { Check, X, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate, formatCurrency, getStatusLabel, getStatusColor } from '@/lib/utils'

interface Collaboration {
  id: string
  startup: { id: string; name: string } | null
  partner: {
    id: string
    name: string
    category: string | null
    estimated_saving: number | null
  } | null
  status: string
  rejection_reason: string | null
  created_at: string
  start_date: string | null
  end_date: string | null
  actual_saving: number | null
  notes: string | null
  review: { rating: number; comment: string | null } | null
}

export default function CollaborationsPage() {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selectedCollab, setSelectedCollab] = useState<Collaboration | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [isCompleteOpen, setIsCompleteOpen] = useState(false)
  const [actualSaving, setActualSaving] = useState('')

  useEffect(() => {
    fetchCollaborations()
  }, [filter])

  const fetchCollaborations = async () => {
    try {
      const url = filter
        ? `/api/collaborations?status=${filter}`
        : '/api/collaborations'
      const res = await fetch(url)
      const data = await res.json()
      setCollaborations(data)
    } catch (error) {
      console.error('Failed to fetch collaborations:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string, extra?: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/collaborations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...extra }),
      })

      if (res.ok) {
        fetchCollaborations()
        setIsRejectOpen(false)
        setIsCompleteOpen(false)
        setRejectionReason('')
        setActualSaving('')
      }
    } catch (error) {
      console.error('Failed to update collaboration:', error)
    }
  }

  const handleApprove = (collab: Collaboration) => {
    if (confirm(`${collab.startup?.name || 'Unknown'}의 ${collab.partner?.name || 'Unknown'} 협업을 승인하시겠습니까?`)) {
      updateStatus(collab.id, 'IN_PROGRESS')
    }
  }

  const handleReject = () => {
    if (selectedCollab) {
      updateStatus(selectedCollab.id, 'CANCELLED', { rejectionReason })
    }
  }

  const handleComplete = () => {
    if (selectedCollab) {
      updateStatus(selectedCollab.id, 'COMPLETED', { actualSaving })
    }
  }

  const openRejectModal = (collab: Collaboration) => {
    setSelectedCollab(collab)
    setIsRejectOpen(true)
  }

  const openCompleteModal = (collab: Collaboration) => {
    setSelectedCollab(collab)
    setActualSaving(collab.partner?.estimated_saving?.toString() || '')
    setIsCompleteOpen(true)
  }

  if (loading) {
    return <div className="p-8">로딩 중...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">협업 현황</h1>
          <p className="text-gray-500">모든 협업 요청을 관리합니다</p>
        </div>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          options={[
            { value: '', label: '전체' },
            { value: 'REQUESTED', label: '요청됨' },
            { value: 'REVIEWING', label: '검토중' },
            { value: 'IN_PROGRESS', label: '진행중' },
            { value: 'COMPLETED', label: '완료' },
            { value: 'CANCELLED', label: '거절/취소' },
            { value: 'SELF_ACTIVATED', label: '셀프서비스' },
          ]}
          className="w-40"
        />
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>스타트업</TableHead>
              <TableHead>파트너사</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>요청일</TableHead>
              <TableHead>추정 절감</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collaborations.map((collab) => (
              <TableRow key={collab.id}>
                <TableCell className="font-medium">
                  {collab.startup?.name || 'Unknown'}
                </TableCell>
                <TableCell>
                  <div>
                    <div>{collab.partner?.name || 'Unknown'}</div>
                    <Badge
                      style={{
                        backgroundColor: '#3b82f6' + '20',
                        color: '#3b82f6',
                      }}
                      className="text-xs"
                    >
                      {collab.partner?.category || '미분류'}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(collab.status)}>
                    {getStatusLabel(collab.status)}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(collab.created_at)}</TableCell>
                <TableCell>
                  {collab.partner?.estimated_saving
                    ? formatCurrency(collab.partner.estimated_saving)
                    : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedCollab(collab)
                        setIsDetailOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {(collab.status === 'REQUESTED' || collab.status === 'REVIEWING') && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleApprove(collab)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => openRejectModal(collab)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {collab.status === 'IN_PROGRESS' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openCompleteModal(collab)}
                      >
                        완료 처리
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="협업 상세"
        className="max-w-lg"
      >
        {selectedCollab && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">스타트업</p>
                <p className="font-medium">{selectedCollab.startup?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">파트너사</p>
                <p className="font-medium">{selectedCollab.partner?.name || 'Unknown'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">상태</p>
                <Badge className={getStatusColor(selectedCollab.status)}>
                  {getStatusLabel(selectedCollab.status)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">요청일</p>
                <p>{formatDate(selectedCollab.created_at)}</p>
              </div>
            </div>
            {selectedCollab.rejection_reason && (
              <div className="bg-red-50 p-3 rounded">
                <p className="text-sm text-red-600 font-medium">거절 사유</p>
                <p className="text-red-700">{selectedCollab.rejection_reason}</p>
              </div>
            )}
            {selectedCollab.notes && (
              <div>
                <p className="text-sm text-gray-500">메모</p>
                <p>{selectedCollab.notes}</p>
              </div>
            )}
            {selectedCollab.review && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">리뷰</p>
                <p>평점: {selectedCollab.review.rating}/5</p>
                {selectedCollab.review.comment && (
                  <p className="mt-1 text-gray-600">{selectedCollab.review.comment}</p>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        title="협업 거절"
      >
        <div className="space-y-4">
          <p>
            {selectedCollab?.startup?.name || 'Unknown'}의 {selectedCollab?.partner?.name || 'Unknown'} 협업을 거절합니다.
          </p>
          <Textarea
            label="거절 사유"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="거절 사유를 입력하세요"
            required
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              거절
            </Button>
          </div>
        </div>
      </Modal>

      {/* Complete Modal */}
      <Modal
        isOpen={isCompleteOpen}
        onClose={() => setIsCompleteOpen(false)}
        title="협업 완료 처리"
      >
        <div className="space-y-4">
          <p>
            {selectedCollab?.startup?.name || 'Unknown'}의 {selectedCollab?.partner?.name || 'Unknown'} 협업을 완료 처리합니다.
          </p>
          <Input
            label="실제 절감 비용 (원)"
            type="number"
            value={actualSaving}
            onChange={(e) => setActualSaving(e.target.value)}
            placeholder="실제 절감된 비용을 입력하세요"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCompleteOpen(false)}>
              취소
            </Button>
            <Button variant="success" onClick={handleComplete}>
              완료 처리
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
