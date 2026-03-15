export interface PerkItem {
  id: string;
  partnerName: string;
  category: string;
  description: string;
  logo: string | null;
  discount: string;
  details: string[];
  applyNote: string;
  status: "활성" | "마감";
  notionPageId: string | null;
}

export const PERKS: PerkItem[] = [
  {
    id: "openai",
    partnerName: "OpenAI",
    category: "API 크레딧",
    description:
      "OpenAI API 크레딧 $5,000 제공 및 Tier 5 업그레이드를 통해 최고 수준의 사용 한도와 최신 모델(GPT-4o 등) 접근 권한을 지원합니다.",
    logo: null,
    discount: "$5,000 크레딧",
    details: [
      "$5,000 상당 OpenAI API 크레딧 제공",
      "Tier 5 등급 업그레이드 (최고 사용 한도)",
      "월간 기술 강연 및 스타트업 이벤트 참여",
      "전문 AI 리소스 접근 권한",
    ],
    applyNote: "시리즈B 이전 스타트업 대상",
    status: "활성",
    notionPageId: "319554b4-bcb5-81e0-8e23-e583585a5e7a",
  },
  {
    id: "anthropic",
    partnerName: "Anthropic",
    category: "API 크레딧",
    description:
      "Claude API $5,000+α 크레딧(6개월)과 Tier 4 업그레이드, Anthropic 전담 고객지원을 제공합니다.",
    logo: null,
    discount: "$5,000+α 크레딧",
    details: [
      "$5,000+α 상당 Claude API 크레딧 (6개월 내 사용)",
      "Tier 4 등급 업그레이드 (높은 Rate Limit)",
      "Anthropic 계정팀 맞춤 지원 및 전용 문의 메일",
      "$10,000 이상 필요 시 별도 문의 가능",
    ],
    applyNote: "회사 이메일로 Anthropic Console 가입 필요",
    status: "활성",
    notionPageId: "319554b4-bcb5-8100-a8a1-c05764afb44d",
  },
  {
    id: "microsoft",
    partnerName: "Microsoft",
    category: "클라우드 크레딧",
    description:
      "Microsoft for Startups를 통한 Azure 크레딧 지원, Co-sell 프로그램, 글로벌 스케일업 워크숍을 제공합니다.",
    logo: null,
    discount: "Azure 크레딧",
    details: [
      "Azure 클라우드 크레딧 지원",
      "Co-sell 프로그램 참여 기회",
      "글로벌 스케일업 워크숍",
      "Microsoft for Startups 프로그램 연계",
    ],
    applyNote: "",
    status: "활성",
    notionPageId: "319554b4-bcb5-817a-8744-c6f6ed727585",
  },
  {
    id: "aws",
    partnerName: "AWS",
    category: "클라우드 크레딧",
    description:
      "AWS Activate 크레딧 $10,000(2년)과 아키텍처 리뷰, Activate 콘솔 접근을 제공합니다.",
    logo: null,
    discount: "$10,000 크레딧",
    details: [
      "AWS Activate 크레딧 $10,000 (2년간 사용)",
      "아키텍처 리뷰 지원",
      "Activate 콘솔 접근 권한",
    ],
    applyNote: "제휴코드: 1pEDQ",
    status: "활성",
    notionPageId: "324554b4-bcb5-81db-b141-e7ef0294ba3d",
  },
  {
    id: "notion",
    partnerName: "Notion",
    category: "인프라/SaaS",
    description:
      "Notion Plus Plan 6개월 무료 이용권을 제공합니다. 무제한 AI 기능이 포함됩니다.",
    logo: null,
    discount: "6개월 무료",
    details: [
      "Notion Plus Plan 6개월 무료 (무제한 AI 포함)",
      "대상: 노션 유료결제 경험이 없는 신규 계정",
      "직원 50인 이하, 130억 이하 투자 기업",
    ],
    applyNote: "신규 계정 대상",
    status: "활성",
    notionPageId: "319554b4-bcb5-8083-abab-e56fc3998281",
  },
];

export const PERK_CATEGORIES = Array.from(
  new Set(PERKS.map((p) => p.category))
);
