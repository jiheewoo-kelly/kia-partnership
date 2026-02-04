'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/ui/star-rating'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/utils'

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  collaboration: {
    startup: { name: string }
    partner: {
      name: string
      category: { name: string; color: string }
    }
  }
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews')
      const data = await res.json()
      setReviews(data)
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  if (loading) {
    return <div className="p-8">로딩 중...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">리뷰 관리</h1>
          <p className="text-gray-500">
            총 {reviews.length}개 리뷰 | 평균 {avgRating}점
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>스타트업</TableHead>
              <TableHead>파트너사</TableHead>
              <TableHead>평점</TableHead>
              <TableHead>후기</TableHead>
              <TableHead>작성일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-medium">
                  {review.collaboration.startup.name}
                </TableCell>
                <TableCell>
                  <div>
                    <div>{review.collaboration.partner.name}</div>
                    <Badge
                      style={{
                        backgroundColor: (review.collaboration?.partner?.category?.color || '#3b82f6') + '20',
                        color: review.collaboration?.partner?.category?.color || '#3b82f6',
                      }}
                      className="text-xs"
                    >
                      {review.collaboration.partner.category.name}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <StarRating rating={review.rating} readonly size="sm" />
                </TableCell>
                <TableCell className="max-w-md">
                  <p className="text-gray-600 truncate">
                    {review.comment || '-'}
                  </p>
                </TableCell>
                <TableCell>{formatDate(review.createdAt)}</TableCell>
              </TableRow>
            ))}
            {reviews.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  아직 리뷰가 없습니다
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
