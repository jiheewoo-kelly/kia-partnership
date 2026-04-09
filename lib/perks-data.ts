export interface PerkItem {
  id: string;
  partnerName: string;
  categories: string[];
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
    categories: ["API/AI"],
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
    categories: ["API/AI"],
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
    categories: ["클라우드/인프라"],
    description:
      "Microsoft for Startups Investor Network를 통해 최대 $150,000 Azure 크레딧과 고급 AI 서비스, 전문가 기술 지침, 시장 출시 지원을 제공합니다.",
    logo: null,
    discount: "최대 $150,000 크레딧",
    details: [
      "Azure 크레딧 최대 $150,000 지원",
      "고급 AI 서비스 및 GPU 액세스",
      "증가된 전문가 기술 지침 및 향상된 혜택",
      "시장 출시(GTM) 지원",
    ],
    applyNote: "Microsoft for Startups Investor Network 소속 스타트업 대상",
    status: "활성",
    notionPageId: "319554b4-bcb5-817a-8744-c6f6ed727585",
  },
  {
    id: "nvidia",
    partnerName: "NVIDIA",
    categories: ["API/AI", "클라우드/인프라"],
    description:
      "NVIDIA Inception Program을 통해 AWS Activate 크레딧 최대 $100,000, Nebius AI 클라우드 크레딧 최대 $150,000, GPU 우대 가격, DLI 교육 등 다양한 혜택을 제공합니다.",
    logo: null,
    discount: "최대 $250,000+ 크레딧",
    details: [
      "AWS Activate 크레딧 최대 $100,000",
      "Nebius AI 클라우드 크레딧 최대 $150,000",
      "NVIDIA GPU 하드웨어/소프트웨어 우대 가격",
      "NVIDIA DLI(Deep Learning Institute) 무료 교육 크레딧",
      "SDK 접근 및 최신 모델 라이브러리",
      "마케팅 지원 (NVIDIA 뉴스레터, 케이스스터디 게재)",
      "Inception Capital Connect를 통한 VC 네트워크 소개",
    ],
    applyNote: "개발자 1명 이상, 법인 설립 10년 미만, 운영 중인 웹사이트 보유 필요",
    status: "활성",
    notionPageId: "33c554b4-bcb5-8168-9353-f97dcdeafff8",
  },
  {
    id: "spin",
    partnerName: "S.Pin Technology",
    categories: ["클라우드/인프라"],
    description:
      "Microsoft 전문 파트너 S.Pin Technology가 Azure 클라우드, GitHub, Azure OpenAI 비용을 최대 1,000만원 상당 지원하며, SaaS 홍보·마케팅 펀드도 제공합니다. Microsoft 지원 크레딧과 중복 적용 가능합니다.",
    logo: "/spin-logo.png",
    discount: "최대 1,000만원 상당",
    details: [
      "Azure 클라우드 비용 지원 — 인프라 전환·확장용 크레딧",
      "GitHub 라이선스 비용 지원 — Advanced Security, Copilot 등",
      "Azure OpenAI 비용 지원 — AI 기능 개발·PoC용 API 크레딧",
      "세 가지 합산 Azure 도입 비용 1,000만원 상당 지원",
      "Microsoft 지원 크레딧과 중복 적용 가능",
      "S.Pin 파트너 및 고객사 150개사 대상 정기 SaaS 솔루션 소개",
      "국내 GTM을 위한 고객 대상 세미나·웨비나 비용 회당 최대 300만원 지원",
    ],
    applyNote: "",
    status: "활성",
    notionPageId: "336554b4-bcb5-8127-a072-c5cdf00e08a1",
  },
  {
    id: "aws",
    partnerName: "AWS",
    categories: ["클라우드/인프라"],
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
    categories: ["클라우드/인프라"],
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
  {
    id: "linkedin",
    partnerName: "LinkedIn",
    categories: ["글로벌"],
    description:
      "LinkedIn APAC 파트너십을 통해 디렉터급 1:1 무료 컨설팅을 제공합니다. 링크드인 활용 전략, B2B 마케팅, 글로벌 네트워킹을 지원합니다.",
    logo: null,
    discount: "무료 컨설팅",
    details: [
      "LinkedIn APAC 디렉터 1:1 무료 컨설팅",
      "링크드인 활용 전략 수립 지원",
      "B2B 마케팅 및 글로벌 네트워킹",
    ],
    applyNote: "KIAC 사업운영실을 통해 이메일 접수",
    status: "활성",
    notionPageId: "319554b4-bcb5-816b-bc73-fd4ed5913974",
  },
  {
    id: "teamcookie",
    partnerName: "팀쿠키 (Team Cookie)",
    categories: ["마케팅/PR"],
    description:
      "테크 스타트업 전문 PR 기업 팀쿠키의 언론홍보/PR 서비스를 KIAC 포트폴리오사 대상 10% 할인된 가격으로 이용할 수 있습니다.",
    logo: null,
    discount: "10% 할인",
    details: [
      "KIAC 포트폴리오사 대상 PR 서비스 10% 할인",
      "기업별 최종 견적에 따라 플랜 조정 가능, 어떤 모델이든 10% 적용",
      "연간 단위 언론홍보/PR 전략 설계 및 실행",
    ],
    applyNote: "KIAC 사업운영실을 통해 신청",
    status: "활성",
    notionPageId: "33c554b4-bcb5-8116-8a09-ede31d67ec28",
  },
];

export const PERK_CATEGORIES = Array.from(
  new Set(PERKS.flatMap((p) => p.categories))
);
