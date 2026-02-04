// Mock 데이터 저장소
export type Role = 'ADMIN' | 'STARTUP'
export type ServiceType = 'SELF_SERVICE' | 'APPROVAL_REQUIRED'
export type PartnerStatus = 'ACTIVE' | 'INACTIVE'
export type CollaborationStatus = 'SELF_ACTIVATED' | 'REQUESTED' | 'REVIEWING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export interface User {
  id: string
  email: string
  password: string
  name: string
  role: Role
  startupId: string | null
}

export interface Startup {
  id: string
  name: string
  description: string | null
  industry: string | null
  stage: string | null
  contactEmail: string
}

export interface Category {
  id: string
  name: string
  description: string | null
  color: string
}

export interface Partner {
  id: string
  name: string
  description: string | null
  categoryId: string
  serviceType: ServiceType
  benefits: string | null
  usageGuide: string | null
  selfServiceInfo: string | null
  estimatedSaving: number | null
  contactName: string | null
  contactEmail: string | null
  contactPhone: string | null
  contractStart: string | null
  contractEnd: string | null
  status: PartnerStatus
}

export interface Collaboration {
  id: string
  startupId: string
  partnerId: string
  status: CollaborationStatus
  rejectionReason: string | null
  requestDate: string
  startDate: string | null
  endDate: string | null
  actualSaving: number | null
  notes: string | null
}

export interface Review {
  id: string
  collaborationId: string
  rating: number
  comment: string | null
  createdAt: string
}

// 초기 데이터
export const users: User[] = [
  {
    id: 'user-admin',
    email: 'admin@kia.com',
    password: '$2a$10$XQxBtLNSiPe5FxnEHGHPxeJ8FLHnEj5JXKZ9XgHHHKJBHXKHHHHHH', // admin123
    name: '관리자',
    role: 'ADMIN',
    startupId: null,
  },
  {
    id: 'user-1',
    email: 'user1@techstartup.com',
    password: '$2a$10$XQxBtLNSiPe5FxnEHGHPxeJ8FLHnEj5JXKZ9XgHHHKJBHXKHHHHH', // user123
    name: '김스타트업',
    role: 'STARTUP',
    startupId: 'startup-1',
  },
  {
    id: 'user-2',
    email: 'user2@fintechlab.com',
    password: '$2a$10$XQxBtLNSiPe5FxnEHGHPxeJ8FLHnEj5JXKZ9XgHHHKJBHXKHHHHH', // user123
    name: '이핀테크',
    role: 'STARTUP',
    startupId: 'startup-2',
  },
]

export const startups: Startup[] = [
  {
    id: 'startup-1',
    name: '테크스타트업',
    description: 'AI 기반 솔루션 개발',
    industry: 'AI/ML',
    stage: 'Series A',
    contactEmail: 'contact@techstartup.com',
  },
  {
    id: 'startup-2',
    name: '핀테크랩',
    description: '핀테크 서비스',
    industry: 'Fintech',
    stage: 'Seed',
    contactEmail: 'contact@fintechlab.com',
  },
]

export const categories: Category[] = [
  { id: 'cat-1', name: '클라우드/인프라', description: 'AWS, GCP, Azure 등 클라우드 서비스', color: '#3b82f6' },
  { id: 'cat-2', name: '마케팅/광고', description: '디지털 마케팅, 광고 플랫폼', color: '#10b981' },
  { id: 'cat-3', name: '법률/회계', description: '법무, 세무, 회계 서비스', color: '#f59e0b' },
  { id: 'cat-4', name: '인사/채용', description: 'HR 솔루션, 채용 플랫폼', color: '#8b5cf6' },
  { id: 'cat-5', name: '개발/디자인', description: '개발 도구, 디자인 툴', color: '#ec4899' },
]

export const partners: Partner[] = [
  {
    id: 'partner-1',
    name: 'AWS',
    description: 'Amazon Web Services 클라우드 서비스',
    categoryId: 'cat-1',
    serviceType: 'SELF_SERVICE',
    benefits: '최대 $10,000 크레딧 제공',
    usageGuide: '1. AWS 계정 생성\n2. 아래 프로모션 코드 입력\n3. 크레딧 자동 적용',
    selfServiceInfo: '프로모션 코드: KIA-STARTUP-2024',
    estimatedSaving: 10000000,
    contactName: '김클라우드',
    contactEmail: 'aws@partner.com',
    contactPhone: '02-1234-5678',
    contractStart: null,
    contractEnd: null,
    status: 'ACTIVE',
  },
  {
    id: 'partner-2',
    name: 'Google Ads',
    description: 'Google 광고 플랫폼',
    categoryId: 'cat-2',
    serviceType: 'SELF_SERVICE',
    benefits: '광고비 $500 크레딧',
    usageGuide: '1. Google Ads 계정 접속\n2. 프로모션 메뉴에서 코드 입력',
    selfServiceInfo: '쿠폰 코드: KIASTARTUP500',
    estimatedSaving: 650000,
    contactName: '이마케팅',
    contactEmail: 'google@partner.com',
    contactPhone: '02-2345-6789',
    contractStart: null,
    contractEnd: null,
    status: 'ACTIVE',
  },
  {
    id: 'partner-3',
    name: '법무법인 스타트업',
    description: '스타트업 전문 법률 서비스',
    categoryId: 'cat-3',
    serviceType: 'APPROVAL_REQUIRED',
    benefits: '법률 자문 50% 할인, 무료 상담 1회',
    usageGuide: '1. 협업 요청 시 필요 서류: 사업자등록증, 문의 내용\n2. 승인 후 담당 변호사 배정\n3. 초기 상담 무료 진행',
    selfServiceInfo: null,
    estimatedSaving: 3000000,
    contactName: '박변호사',
    contactEmail: 'law@partner.com',
    contactPhone: '02-3456-7890',
    contractStart: null,
    contractEnd: null,
    status: 'ACTIVE',
  },
  {
    id: 'partner-4',
    name: 'HR솔루션',
    description: '스타트업 채용 및 인사 관리',
    categoryId: 'cat-4',
    serviceType: 'APPROVAL_REQUIRED',
    benefits: '채용 컨설팅 무료, 인사 시스템 3개월 무료',
    usageGuide: '1. 현재 인원 규모 및 채용 계획 준비\n2. 사용 중인 HR 시스템 정보',
    selfServiceInfo: null,
    estimatedSaving: 5000000,
    contactName: '최인사',
    contactEmail: 'hr@partner.com',
    contactPhone: '02-4567-8901',
    contractStart: null,
    contractEnd: null,
    status: 'ACTIVE',
  },
  {
    id: 'partner-5',
    name: 'Figma',
    description: '협업 디자인 툴',
    categoryId: 'cat-5',
    serviceType: 'SELF_SERVICE',
    benefits: 'Professional 플랜 1년 무료',
    usageGuide: '1. Figma 계정 생성\n2. 아래 링크에서 스타트업 프로그램 신청\n3. 자동 승인 (KIA 파트너 코드 자동 적용)',
    selfServiceInfo: '신청 링크: https://figma.com/startup-program?code=KIA2024',
    estimatedSaving: 180000,
    contactName: '정디자인',
    contactEmail: 'figma@partner.com',
    contactPhone: '02-5678-9012',
    contractStart: null,
    contractEnd: null,
    status: 'ACTIVE',
  },
]

export const collaborations: Collaboration[] = []

export const reviews: Review[] = []

// Helper functions
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}
