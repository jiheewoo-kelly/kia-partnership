import Hero from "@/components/Hero";
import NewsCard from "@/components/NewsCard";
import { getNews, getPartnerLogos } from "@/lib/notion";
import { PERKS } from "@/lib/perks-data";
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
        <div className="max-w-5xl mx-auto px-6 py-14">
          <p className="text-blue text-sm font-semibold tracking-[0.3em] uppercase mb-3">
            NEWS
          </p>
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-3xl font-bold text-main">최신 소식</h2>
            <Link
              href="/news"
              className="text-base text-gray-400 hover:text-blue transition-colors"
            >
              더보기 →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsData.items.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
          {newsData.items.length === 0 && (
            <p className="text-center text-gray-300 py-16">
              등록된 소식이 없습니다.
            </p>
          )}
        </div>
      </section>

      {/* Perks 횡스크롤 섹션 */}
      <section className="bg-cream/20 py-14 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 mb-8">
          <p className="text-blue text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            PARTNERSHIP PERKS
          </p>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold text-main">
              파트너 혜택
            </h2>
            <Link
              href="/perks"
              className="text-base text-gray-400 hover:text-blue transition-colors"
            >
              전체보기 →
            </Link>
          </div>
        </div>

        <div className="group">
          <div className="flex animate-scroll-left">
            {scrollPerks.map((item, i) => (
              <div key={`${item.id}-${i}`} className="flex-shrink-0 w-64 mx-3">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 min-h-[280px] flex flex-col hover:border-blue/40 transition-colors">
                  <div className="h-12 flex items-center mb-4">
                    {item.logo ? (
                      <img
                        src={item.logo}
                        alt={item.partnerName}
                        className="h-8 max-w-[100px] object-contain"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-300">
                          {item.partnerName[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-blue text-sm font-semibold mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-base font-bold text-main mb-2">
                    {item.partnerName}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-4">
                    {item.description}
                  </p>
                  {item.discount && (
                    <p className="text-sm font-semibold text-main mt-3">
                      {item.discount}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
