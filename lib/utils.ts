import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    SELF_ACTIVATED: '즉시 이용',
    REQUESTED: '요청됨',
    REVIEWING: '검토중',
    IN_PROGRESS: '진행중',
    COMPLETED: '완료',
    CANCELLED: '거절/취소',
  }
  return labels[status] || status
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    SELF_ACTIVATED: 'bg-green-100 text-green-800',
    REQUESTED: 'bg-yellow-100 text-yellow-800',
    REVIEWING: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
