import Hero from "@/components/Hero";
import NewsCard from "@/components/NewsCard";
import { getNews, getPartnerLogos } from "@/lib/notion";
import { PERKS } from "@/lib/perks-data";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const previewPerks = PERKS.filter((p) => p.status === "활성").slice(0, 6);

  const pageIds = previewPerks
    .map((p) => p.notionPageId)
    .filter((id): id is string => id !== null);

  const [newsData, logos] = await Promise.all([
    getNews({ pageSize: 3 }),
    getPartnerLogos(pageIds),
  ]);

  const perksWithLogos = previewPerks.map((p) => ({
    ...p,
    logo: p.notionPageId ? logos[p.notionPageId] || null : null,
  }));

  // 카드를 복제하여 무한 스크롤 효과용
  const scrollPerks = [...perksWithLogos, ...perksWithLogos];

  return (
    <>
      <Hero />

      {/* 최신 소식 섹션 */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6 pt-6 md:pt-8 pb-10 md:pb-14">
          <p className="text-blue text-xs md:text-sm font-semibold tracking-[0.3em] uppercase mb-2 md:mb-3">
            NEWS
          </p>
          <div className="flex items-end justify-between mb-5 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-main">최신 소식</h2>
            <Link
              href="/news"
              className="text-sm md:text-base text-gray-400 hover:text-blue transition-colors"
            >
              더보기 →
            </Link>
          </div>
          {/* 모바일: 좌우 스크롤 / 데스크톱: 3열 그리드 */}
          <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {newsData.items.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-[72vw] md:w-auto snap-start">
                <NewsCard item={item} />
              </div>
            ))}
          </div>
          {newsData.items.length === 0 && (
            <p className="text-center text-gray-300 py-16">
              등록된 소식이 없습니다.
            </p>
          )}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6"><hr className="border-gray-200" /></div>

      {/* Perks 횡스크롤 섹션 */}
      <section className="bg-cream/20 py-10 md:py-14 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 md:px-6 mb-5 md:mb-8">
          <p className="text-blue text-xs md:text-sm font-semibold tracking-[0.3em] uppercase mb-3 md:mb-4">
            PARTNERSHIP PERKS
          </p>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl md:text-3xl font-bold text-main">
              파트너 혜택
            </h2>
            <Link
              href="/perks"
              className="text-sm md:text-base text-gray-400 hover:text-blue transition-colors"
            >
              전체보기 →
            </Link>
          </div>
        </div>

        <div className="group">
          <div className="flex animate-scroll-left md:animate-scroll-left-desktop">
            {scrollPerks.map((item, i) => (
              <div key={`${item.id}-${i}`} className="flex-shrink-0 w-52 md:w-64 mx-2 md:mx-3">
                <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-6 min-h-[220px] md:min-h-[280px] flex flex-col hover:border-blue/40 transition-colors">
                  <div className="h-10 md:h-12 flex items-center mb-3 md:mb-4">
                    {item.logo ? (
                      <Image
                        src={item.logo}
                        alt={item.partnerName}
                        width={100}
                        height={32}
                        className="h-6 md:h-8 max-w-[80px] md:max-w-[100px] object-contain"
                      />
                    ) : (
                      <div className="w-7 md:w-8 h-7 md:h-8 bg-gray-100 rounded-md flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-300">
                          {item.partnerName[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-blue text-xs md:text-sm font-semibold mb-1">
                    {item.categories[0]}
                  </span>
                  <h3 className="text-sm md:text-base font-bold text-main mb-1 md:mb-2">
                    {item.partnerName}
                  </h3>
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed flex-1 line-clamp-3 md:line-clamp-4">
                    {item.description}
                  </p>
                  {item.discount && (
                    <p className="text-xs md:text-sm font-semibold text-main mt-2 md:mt-3">
                      {item.discount}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6"><hr className="border-gray-200" /></div>

      {/* Support 섹션 */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6 pt-6 md:pt-8 pb-10 md:pb-14">
          <p className="text-blue text-xs md:text-sm font-semibold tracking-[0.3em] uppercase mb-2 md:mb-3">
            PORTFOLIO SUPPORT
          </p>
          <div className="flex items-end justify-between mb-5 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-main">도움 요청하기</h2>
            <Link
              href="/support"
              className="text-sm md:text-base text-gray-400 hover:text-blue transition-colors"
            >
              전체보기 →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            <Link
              href="/support/pr"
              className="group bg-white border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center hover:border-blue/30 hover:shadow-md transition-all"
            >
              <h3 className="text-lg font-bold text-main mb-4">PR 지원</h3>
              <div className="w-full aspect-[7/5] rounded-xl overflow-hidden mb-5">
                <Image src="/support-pr.svg" alt="PR 지원" width={280} height={200} className="w-full h-full object-cover" />
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">보도자료 작성 및 배포 지원</p>
            </Link>
            <a
              href="https://docs.google.com/forms/d/1mGx7G9CRBK2K5XPgDxqCpj7agD3cWoO0OT-eyO_gevM/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center hover:border-blue/30 hover:shadow-md transition-all"
            >
              <h3 className="text-lg font-bold text-main mb-4">대관 지원</h3>
              <div className="w-full aspect-[7/5] rounded-xl overflow-hidden mb-5">
                <Image src="/support-venue.svg" alt="대관 지원" width={280} height={200} className="w-full h-full object-cover" />
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">행사 및 미팅 공간 대관 지원</p>
            </a>
            <Link
              href="/support/general"
              className="group bg-white border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center hover:border-blue/30 hover:shadow-md transition-all"
            >
              <h3 className="text-lg font-bold text-main mb-4">기타 지원</h3>
              <div className="w-full aspect-[7/5] rounded-xl overflow-hidden mb-5">
                <Image src="/support-general.svg" alt="기타 지원" width={280} height={200} className="w-full h-full object-cover" />
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">기타 지원 요청 접수</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
