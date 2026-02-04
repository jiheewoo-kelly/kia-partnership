'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Partner {
  id: string
  name: string
  description: string | null
  category?: string | null
  contact_name?: string | null
  contact_email?: string | null
  website?: string | null
  is_active?: boolean
}


const initialFormData = {
  name: '',
  description: '',
  category: '',
  contact_name: '',
  contact_email: '',
  website: '',
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [formData, setFormData] = useState(initialFormData)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/partners')
      const data = await res.json()
      setPartners(data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingPartner
        ? `/api/partners/${editingPartner.id}`
        : '/api/partners'
      const method = editingPartner ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        fetchData()
        handleCloseModal()
      }
    } catch (error) {
      console.error('Failed to save partner:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const res = await fetch(`/api/partners/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchData()
      } else {
        const data = await res.json()
        alert(data.error)
      }
    } catch (error) {
      console.error('Failed to delete partner:', error)
    }
  }

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner)
    setFormData({
      name: partner.name,
      description: partner.description || '',
      category: partner.category || '',
      contact_name: partner.contact_name || '',
      contact_email: partner.contact_email || '',
      website: partner.website || '',
    })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPartner(null)
    setFormData(initialFormData)
  }

  if (loading) {
    return <div className="p-8">로딩 중...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">파트너사 관리</h1>
          <p className="text-gray-500">파트너사 정보를 관리합니다</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          파트너사 추가
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>파트너사</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>연락처</TableHead>
              <TableHead>웹사이트</TableHead>
              <TableHead>평점</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{partner.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {partner.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge>
                    {partner.category || '-'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {partner.contact_email || '-'}
                </TableCell>
                <TableCell>
                  {partner.website || '-'}
                </TableCell>
                <TableCell>-</TableCell>
                <TableCell>
                  <Badge variant={partner.is_active ? 'success' : 'secondary'}>
                    {partner.is_active ? '활성' : '비활성'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedPartner(partner)
                        setIsDetailOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(partner)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(partner.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
        title={selectedPartner?.name}
        className="max-w-2xl"
      >
        {selectedPartner && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700">설명</h4>
              <p className="text-gray-600 whitespace-pre-wrap">
                {selectedPartner.description || '-'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700">카테고리</h4>
                <p className="text-gray-600">{selectedPartner.category || '-'}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">담당자</h4>
                <p className="text-gray-600">{selectedPartner.contact_name || '-'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700">이메일</h4>
                <p className="text-gray-600">{selectedPartner.contact_email || '-'}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">웹사이트</h4>
                <p className="text-gray-600">{selectedPartner.website || '-'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPartner ? '파트너사 수정' : '파트너사 추가'}
        className="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="파트너사명"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Textarea
            label="설명"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Input
            label="카테고리"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="예: AI/ML, Battery/Energy"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="담당자명"
              value={formData.contact_name}
              onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
            />
            <Input
              label="이메일"
              type="email"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            />
          </div>

          <Input
            label="웹사이트"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              취소
            </Button>
            <Button type="submit">
              {editingPartner ? '수정' : '추가'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
