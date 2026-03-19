# Partnership Platform

한국투자액셀러레이터 포트폴리오사를 위한 파트너십 프로그램 웹사이트.

## Tech Stack
Next.js 14 (App Router), TypeScript, Tailwind CSS, Notion API, Vercel

## Notion DB 매핑
- Program DB → 최신 소식 (항목명, 구분, 날짜, 내용, 포스터, 신청링크, 상태)
- Partners DB → 파트너 로고 (파일과 미디어)
- Portfolios DB → 포트폴리오사 정보
- Perk 신청 DB → 혜택 신청 접수 (Partners, Portfolios relation 연결)

## 주요 규칙
- 뉴스는 2026년 이후 + 상태가 "모집 중" 또는 "종료"인 것만 노출
- Perks 데이터는 lib/perks-data.ts에 하드코딩
- 환경 변수는 .env.local (git 제외됨)
- Vercel 배포: https://partnership-ten.vercel.app
