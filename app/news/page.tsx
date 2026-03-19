import { Suspense } from "react";
import { getNews } from "@/lib/notion";
import NewsCard from "@/components/NewsCard";
import CategoryFilter from "@/components/CategoryFilter";
import Pagination from "@/components/Pagination";

export const dynamic = "force-dynamic";

const NEWS_CATEGORIES = ["세션", "바른동행 지원", "데모데이", "커뮤니티", "대관"];

export default async function NewsPage({
  searchParams,
}: {
  searchParams: { category?: string; page?: string };
}) {
  const category = searchParams.category || "";
  const page = parseInt(searchParams.page || "1", 10);

  const data = await getNews({ category: category || undefined, pageSize: 12 });

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-28">
        <p className="text-blue text-xs font-semibold tracking-[0.3em] uppercase mb-4">
          NEWS
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-main mb-3">소식</h1>
        <p className="text-gray-400 mb-12">
          한국투자액셀러레이터의 최신 소식을 확인하세요.
        </p>

        <Suspense fallback={null}>
          <CategoryFilter categories={NEWS_CATEGORIES} basePath="/news" />
        </Suspense>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {data.items.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>

        {data.items.length === 0 && (
          <p className="text-center text-gray-300 py-20">
            해당 카테고리의 소식이 없습니다.
          </p>
        )}

        <Suspense fallback={null}>
          <Pagination
            currentPage={page}
            hasNext={!!data.nextCursor}
            basePath="/news"
          />
        </Suspense>
      </div>
    </div>
  );
}
