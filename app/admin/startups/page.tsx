'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

interface Startup {
  id: string
  name: string
  description: string | null
  category?: string | null
  contact_email?: string | null
  contact_name?: string | null
  users?: { id: string; email: string; name: string }[]
  _count?: { collaborations: number }
}

const initialFormData = {
  name: '',
  description: '',
  industry: '',
  stage: '',
  contactEmail: '',
  userName: '',
  userEmail: '',
  userPassword: '',
}

export default function StartupsPage() {
  const [startups, setStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStartup, setEditingStartup] = useState<Startup | null>(null)
  const [formData, setFormData] = useState(initialFormData)

  useEffect(() => {
    fetchStartups()
  }, [])

  const fetchStartups = async () => {
    try {
      const res = await fetch('/api/startups')
      const data = await res.json()
      setStartups(data)
    } catch (error) {
      console.error('Failed to fetch startups:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingStartup
        ? `/api/startups/${editingStartup.id}`
        : '/api/startups'
      const method = editingStartup ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        fetchStartups()
        handleCloseModal()
      }
    } catch (error) {
      console.error('Failed to save startup:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const res = await fetch(`/api/startups/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchStartups()
      } else {
        const data = await res.json()
        alert(data.error)
      }
    } catch (error) {
      console.error('Failed to delete startup:', error)
    }
  }

  const handleEdit = (startup: Startup) => {
    setEditingStartup(startup)
    setFormData({
      name: startup.name,
      description: startup.description || '',
      industry: startup.category || '',
      stage: '',
      contactEmail: startup.contact_email || '',
      userName: '',
      userEmail: '',
      userPassword: '',
    })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingStartup(null)
    setFormData(initialFormData)
  }

  if (loading) {
    return <div className="p-8">로딩 중...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">스타트업 관리</h1>
          <p className="text-gray-500">포트폴리오 스타트업을 관리합니다</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          스타트업 추가
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>스타트업</TableHead>
              <TableHead>산업</TableHead>
              <TableHead>단계</TableHead>
              <TableHead>연락처</TableHead>
              <TableHead>협업 수</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {startups.map((startup) => (
              <TableRow key={startup.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{startup.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {startup.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{startup.category || '-'}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>
                  <div className="text-sm text-gray-500">
                    {startup.contact_email || '-'}
                  </div>
                </TableCell>
                <TableCell>{startup._count?.collaborations ?? 0}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(startup)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(startup.id)}
                      disabled={(startup._count?.collaborations ?? 0) > 0}
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

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingStartup ? '스타트업 수정' : '스타트업 추가'}
        className="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="스타트업명"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Textarea
            label="설명"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="산업"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              placeholder="예: AI/ML, Fintech"
            />
            <Input
              label="단계"
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
              placeholder="예: Seed, Series A"
            />
          </div>

          <Input
            label="대표 연락 이메일"
            type="email"
            value={formData.contactEmail}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            required
          />

          {!editingStartup && (
            <>
              <hr className="my-4" />
              <p className="text-sm text-gray-500">
                사용자 계정 (선택사항)
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="사용자명"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                />
                <Input
                  label="로그인 이메일"
                  type="email"
                  value={formData.userEmail}
                  onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                />
              </div>
              <Input
                label="비밀번호"
                type="password"
                value={formData.userPassword}
                onChange={(e) => setFormData({ ...formData, userPassword: e.target.value })}
              />
            </>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              취소
            </Button>
            <Button type="submit">
              {editingStartup ? '수정' : '추가'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
