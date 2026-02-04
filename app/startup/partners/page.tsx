'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Zap, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { Textarea } from '@/components/ui/textarea'
import { StarRating } from '@/components/ui/star-rating'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface Partner {
  id: string
  name: string
  description: string | null
  category: { id: string; name: string; color: string }
  serviceType: 'SELF_SERVICE' | 'APPROVAL_REQUIRED'
  benefits: string | null
  usageGuide: string | null
  selfServiceInfo: string | null
  estimatedSaving: number | null
  status: 'ACTIVE' | 'INACTIVE'
  avgRating: number | null
  reviewCount: number
}

interface Category {
  id: string
  name: string
  color: string
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [isSelfServiceOpen, setIsSelfServiceOpen] = useState(false)
  const [requestNotes, setRequestNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [partnersRes, categoriesRes] = await Promise.all([
        fetch('/api/partners?status=ACTIVE'),
        fetch('/api/categories'),
      ])
      const [partnersData, categoriesData] = await Promise.all([
        partnersRes.json(),
        categoriesRes.json(),
      ])
      setPartners(partnersData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPartners = partners.filter((partner) => {
    if (search && !partner.name.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    if (categoryFilter && partner.category.id !== categoryFilter) {
      return false
    }
    if (typeFilter && partner.serviceType !== typeFilter) {
      return false
    }
    return true
  })

  const handleRequest = async () => {
    if (!selectedPartner) return
    setSubmitting(true)

    try {
      const res = await fetch('/api/collaborations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId: selectedPartner.id,
          notes: requestNotes,
        }),
      })

      if (res.ok) {
        alert('협업 요청이 완료되었습니다!')
        setIsRequestOpen(false)
        setRequestNotes('')
      } else {
        const data = await res.json()
        alert(data.error)
      }
    } catch (error) {
      console.error('Failed to request:', error)
      alert('요청 중 오류가 발생했습니다')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSelfService = async () => {
    if (!selectedPartner) return
    setSubmitting(true)

    try {
      const res = await fetch('/api/collaborations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId: selectedPartner.id,
        }),
      })

      if (res.ok) {
        setIsSelfServiceOpen(true)
        setIsDetailOpen(false)
      } else {
        const data = await res.json()
        alert(data.error)
      }
    } catch (error) {
      console.error('Failed to activate:', error)
      alert('활성화 중 오류가 발생했습니다')
    } finally {
      setSubmitting(false)
    }
  }

  const openPartnerDetail = (partner: Partner) => {
    setSelectedPartner(partner)
    setIsDetailOpen(true)
  }

  if (loading) {
    return <div className="p-8">로딩 중...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">파트너사 목록</h1>
        <p className="text-gray-500">
          한국투자액셀러레이터 포트폴리오사 전용 혜택을 확인하세요
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="파트너사 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-md border px-3 text-sm"
          >
            <option value="">전체 카테고리</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 rounded-md border px-3 text-sm"
          >
            <option value="">전체 타입</option>
            <option value="SELF_SERVICE">셀프서비스</option>
            <option value="APPROVAL_REQUIRED">승인필요</option>
          </select>
        </div>
      </div>

      {/* Partner Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPartners.map((partner) => (
          <Card
            key={partner.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => openPartnerDetail(partner)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{partner.name}</CardTitle>
                  <Badge
                    style={{
                      backgroundColor: partner.category.color + '20',
                      color: partner.category.color,
                    }}
                    className="mt-1"
                  >
                    {partner.category.name}
                  </Badge>
                </div>
                <Badge
                  variant={partner.serviceType === 'SELF_SERVICE' ? 'success' : 'default'}
                  className="flex items-center gap-1"
                >
                  {partner.serviceType === 'SELF_SERVICE' ? (
                    <>
                      <Zap className="h-3 w-3" />
                      즉시 이용
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3" />
                      승인 필요
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {partner.description}
              </p>
              <div className="flex items-center justify-between">
                {partner.avgRating ? (
                  <div className="flex items-center gap-1">
                    <StarRating rating={partner.avgRating} readonly size="sm" />
                    <span className="text-sm text-gray-500">
                      ({partner.reviewCount})
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">아직 리뷰 없음</span>
                )}
                {partner.estimatedSaving && (
                  <span className="text-sm font-medium text-green-600">
                    ~{formatCurrency(partner.estimatedSaving)} 절감
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPartners.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          조건에 맞는 파트너사가 없습니다
        </div>
      )}

      {/* Partner Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={selectedPartner?.name}
        className="max-w-2xl"
      >
        {selectedPartner && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge
                style={{
                  backgroundColor: selectedPartner.category.color + '20',
                  color: selectedPartner.category.color,
                }}
              >
                {selectedPartner.category.name}
              </Badge>
              <Badge
                variant={selectedPartner.serviceType === 'SELF_SERVICE' ? 'success' : 'default'}
              >
                {selectedPartner.serviceType === 'SELF_SERVICE' ? '셀프서비스' : '승인 필요'}
              </Badge>
              {selectedPartner.avgRating && (
                <div className="flex items-center gap-1 ml-auto">
                  <StarRating rating={selectedPartner.avgRating} readonly size="sm" />
                  <span className="text-sm text-gray-500">
                    ({selectedPartner.reviewCount}개 리뷰)
                  </span>
                </div>
              )}
            </div>

            <p className="text-gray-600">{selectedPartner.description}</p>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">제공 혜택</h4>
              <p className="text-blue-700 whitespace-pre-wrap">
                {selectedPartner.benefits}
              </p>
              {selectedPartner.estimatedSaving && (
                <p className="mt-2 text-sm text-blue-600">
                  추정 절감 비용: {formatCurrency(selectedPartner.estimatedSaving)}
                </p>
              )}
            </div>

            {selectedPartner.usageGuide && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">이용 가이드</h4>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {selectedPartner.usageGuide}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                닫기
              </Button>
              {selectedPartner.serviceType === 'SELF_SERVICE' ? (
                <Button onClick={handleSelfService} disabled={submitting}>
                  <Zap className="h-4 w-4 mr-2" />
                  즉시 이용하기
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setIsDetailOpen(false)
                    setIsRequestOpen(true)
                  }}
                >
                  협업 요청하기
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Self-Service Info Modal */}
      <Modal
        isOpen={isSelfServiceOpen}
        onClose={() => setIsSelfServiceOpen(false)}
        title="셀프서비스 이용 정보"
      >
        {selectedPartner && (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">
                {selectedPartner.name} 이용 정보
              </h4>
              <p className="text-green-700 whitespace-pre-wrap font-mono text-sm bg-white p-3 rounded border">
                {selectedPartner.selfServiceInfo}
              </p>
            </div>
            <p className="text-sm text-gray-500">
              이 정보를 복사하여 파트너사 서비스에서 사용하세요.
              이용 내역은 &quot;내 협업 현황&quot;에서 확인할 수 있습니다.
            </p>
            <div className="flex justify-end">
              <Button onClick={() => setIsSelfServiceOpen(false)}>
                확인
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Request Modal */}
      <Modal
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
        title="협업 요청"
      >
        {selectedPartner && (
          <div className="space-y-4">
            <p>
              <strong>{selectedPartner.name}</strong>에 협업을 요청합니다.
            </p>
            {selectedPartner.usageGuide && (
              <div className="bg-yellow-50 p-3 rounded text-sm">
                <strong>사전 준비사항:</strong>
                <p className="mt-1 text-gray-600 whitespace-pre-wrap">
                  {selectedPartner.usageGuide}
                </p>
              </div>
            )}
            <Textarea
              label="요청 메모 (선택사항)"
              value={requestNotes}
              onChange={(e) => setRequestNotes(e.target.value)}
              placeholder="협업에 대한 추가 요청사항이 있으면 입력하세요"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsRequestOpen(false)}>
                취소
              </Button>
              <Button onClick={handleRequest} disabled={submitting}>
                {submitting ? '요청 중...' : '협업 요청'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
