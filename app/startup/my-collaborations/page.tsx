'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Textarea } from '@/components/ui/textarea'
import { StarRating } from '@/components/ui/star-rating'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, formatCurrency, getStatusLabel, getStatusColor } from '@/lib/utils'

interface Collaboration {
  id: string
  partner: {
    id: string
    name: string
    category: { name: string; color: string }
    selfServiceInfo: string | null
    estimatedSaving: number | null
  }
  status: string
  rejectionReason: string | null
  requestDate: string
  startDate: string | null
  endDate: string | null
  actualSaving: number | null
  notes: string | null
  review: { id: string; rating: number; comment: string | null } | null
}

export default function MyCollaborationsPage() {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCollab, setSelectedCollab] = useState<Collaboration | null>(null)
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCollaborations()
  }, [])

  const fetchCollaborations = async () => {
    try {
      const res = await fetch('/api/collaborations')
      const data = await res.json()
      setCollaborations(data)
    } catch (error) {
      console.error('Failed to fetch collaborations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async () => {
    if (!selectedCollab) return
    setSubmitting(true)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collaborationId: selectedCollab.id,
          rating: reviewRating,
          comment: reviewComment,
        }),
      })

      if (res.ok) {
        fetchCollaborations()
        setIsReviewOpen(false)
        setReviewRating(5)
        setReviewComment('')
      } else {
        const data = await res.json()
        alert(data.error)
      }
    } catch (error) {
      console.error('Failed to submit review:', error)
      alert('리뷰 작성 중 오류가 발생했습니다')
    } finally {
      setSubmitting(false)
    }
  }

  const activeCollabs = collaborations.filter(
    (c) => ['SELF_ACTIVATED', 'REQUESTED', 'REVIEWING', 'IN_PROGRESS'].includes(c.status)
  )
  const completedCollabs = collaborations.filter(
    (c) => c.status === 'COMPLETED'
  )
  const cancelledCollabs = collaborations.filter(
    (c) => c.status === 'CANCELLED'
  )

  if (loading) {
    return <div className="p-8">로딩 중...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">내 협업 현황</h1>
        <p className="text-gray-500">파트너사 협업 진행 상태를 확인하세요</p>
      </div>

      {/* Active Collaborations */}
      <section>
        <h2 className="text-lg font-semibold mb-4">
          진행 중인 협업 ({activeCollabs.length})
        </h2>
        {activeCollabs.length === 0 ? (
          <p className="text-gray-500">진행 중인 협업이 없습니다</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {activeCollabs.map((collab) => (
              <Card key={collab.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {collab.partner?.name || 'Unknown'}
                      </CardTitle>
                      <Badge
                        style={{
                          backgroundColor: (collab.partner?.category?.color || '#3b82f6') + '20',
                          color: collab.partner?.category?.color || '#3b82f6',
                        }}
                      >
                        {collab.partner?.category?.name || '미분류'}
                      </Badge>
                    </div>
                    <Badge className={getStatusColor(collab.status)}>
                      {getStatusLabel(collab.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">요청일</span>
                      <span>{formatDate(collab.requestDate)}</span>
                    </div>
                    {collab.startDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">시작일</span>
                        <span>{formatDate(collab.startDate)}</span>
                      </div>
                    )}
                    {collab.partner.estimatedSaving && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">추정 절감</span>
                        <span className="text-green-600">
                          {formatCurrency(collab.partner.estimatedSaving)}
                        </span>
                      </div>
                    )}
                  </div>

                  {collab.status === 'SELF_ACTIVATED' && collab.partner.selfServiceInfo && (
                    <div className="mt-4 p-3 bg-green-50 rounded">
                      <p className="text-xs text-green-700 font-medium mb-1">이용 정보</p>
                      <p className="text-sm font-mono bg-white p-2 rounded border">
                        {collab.partner.selfServiceInfo}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Completed Collaborations */}
      <section>
        <h2 className="text-lg font-semibold mb-4">
          완료된 협업 ({completedCollabs.length})
        </h2>
        {completedCollabs.length === 0 ? (
          <p className="text-gray-500">완료된 협업이 없습니다</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {completedCollabs.map((collab) => (
              <Card key={collab.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {collab.partner?.name || 'Unknown'}
                      </CardTitle>
                      <Badge
                        style={{
                          backgroundColor: (collab.partner?.category?.color || '#3b82f6') + '20',
                          color: collab.partner?.category?.color || '#3b82f6',
                        }}
                      >
                        {collab.partner?.category?.name || '미분류'}
                      </Badge>
                    </div>
                    <Badge className={getStatusColor(collab.status)}>
                      {getStatusLabel(collab.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">기간</span>
                      <span>
                        {collab.startDate && formatDate(collab.startDate)} ~{' '}
                        {collab.endDate && formatDate(collab.endDate)}
                      </span>
                    </div>
                    {collab.actualSaving && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">절감 비용</span>
                        <span className="text-green-600 font-medium">
                          {formatCurrency(collab.actualSaving)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    {collab.review ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">내 평가:</span>
                        <StarRating rating={collab.review.rating} readonly size="sm" />
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedCollab(collab)
                          setIsReviewOpen(true)
                        }}
                      >
                        리뷰 작성
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Cancelled Collaborations */}
      {cancelledCollabs.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">
            거절/취소된 협업 ({cancelledCollabs.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {cancelledCollabs.map((collab) => (
              <Card key={collab.id} className="border-red-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {collab.partner?.name || 'Unknown'}
                      </CardTitle>
                      <Badge
                        style={{
                          backgroundColor: (collab.partner?.category?.color || '#3b82f6') + '20',
                          color: collab.partner?.category?.color || '#3b82f6',
                        }}
                      >
                        {collab.partner?.category?.name || '미분류'}
                      </Badge>
                    </div>
                    <Badge className={getStatusColor(collab.status)}>
                      {getStatusLabel(collab.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">요청일</span>
                      <span>{formatDate(collab.requestDate)}</span>
                    </div>
                  </div>

                  {collab.rejectionReason && (
                    <div className="mt-4 p-3 bg-red-50 rounded">
                      <p className="text-xs text-red-700 font-medium mb-1">
                        거절 사유
                      </p>
                      <p className="text-sm text-red-600">
                        {collab.rejectionReason}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        title="리뷰 작성"
      >
        {selectedCollab && (
          <div className="space-y-4">
            <p>
              <strong>{selectedCollab.partner.name}</strong> 협업에 대한 리뷰를
              작성해주세요.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                만족도
              </label>
              <StarRating
                rating={reviewRating}
                onChange={setReviewRating}
                size="lg"
              />
            </div>

            <Textarea
              label="한줄 후기 (선택사항)"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="협업 경험에 대한 후기를 남겨주세요"
            />

            <p className="text-xs text-gray-500">
              * 후기는 관리자만 열람할 수 있으며, 다른 스타트업에게는 평균 별점만
              공개됩니다.
            </p>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsReviewOpen(false)}>
                취소
              </Button>
              <Button onClick={handleReview} disabled={submitting}>
                {submitting ? '제출 중...' : '리뷰 제출'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
