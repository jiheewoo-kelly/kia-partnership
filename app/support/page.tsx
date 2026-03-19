import SupportCard from "@/components/SupportCard";

export default function SupportPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-2xl font-bold text-main mb-3">Support</h1>
        <p className="text-sm text-gray-400 leading-relaxed">
          포트폴리오사를 위한 지원 서비스입니다.
          <br />
          필요한 지원 유형을 선택하여 신청해주세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SupportCard
          title="PR 지원"
          description="보도자료 작성 및 배포를 지원합니다. 기사 내용과 이미지를 함께 제출해주세요."
          href="/support/pr"
          icon={
            <svg
              className="w-6 h-6 text-blue"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          }
        />
        <SupportCard
          title="대관 지원"
          description="행사 및 미팅을 위한 공간 대관을 지원합니다. 일정과 목적을 알려주세요."
          href="https://docs.google.com/forms/d/1mGx7G9CRBK2K5XPgDxqCpj7agD3cWoO0OT-eyO_gevM/viewform"
          external
          icon={
            <svg
              className="w-6 h-6 text-blue"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          }
        />
        <SupportCard
          title="기타 지원"
          description="위 항목에 해당하지 않는 기타 지원 요청을 접수합니다."
          href="/support/general"
          icon={
            <svg
              className="w-6 h-6 text-blue"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>
    </div>
  );
}
