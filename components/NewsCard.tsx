import Image from "next/image";
import { NewsItem } from "@/lib/notion";

function formatDate(raw: string): string {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

const categoryColors: Record<string, string> = {
  세션: "text-blue",
  "바른동행 지원": "text-purple-500",
  데모데이: "text-red-500",
  커뮤니티: "text-indigo-500",
  대관: "text-orange-500",
};

export default function NewsCard({ item }: { item: NewsItem }) {
  const Wrapper = item.link ? "a" : "div";
  const wrapperProps = item.link
    ? { href: item.link, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      {...(wrapperProps as any)}
      className="group block bg-cream/60 border border-gray-100 rounded-2xl overflow-hidden hover:border-blue/40 transition-colors"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden relative">
        {item.thumbnail ? (
          <Image
            src={item.thumbnail}
            alt={item.title}
            width={400}
            height={400}
            sizes="(max-width: 768px) 72vw, 33vw"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-2xl text-gray-300">📰</span>
          </div>
        )}
      </div>
      <div className="p-3 md:p-5">
        <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
          {item.status && (
            <span
              className={`text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 rounded-full ${
                item.status === "모집 중"
                  ? "bg-blue/10 text-blue"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {item.status}
            </span>
          )}
          {item.category && (
            <span
              className={`text-xs md:text-sm font-semibold ${
                categoryColors[item.category] || "text-gray-400"
              }`}
            >
              {item.category}
            </span>
          )}
          {item.date && (
            <>
              <span className="text-gray-200">·</span>
              <span className="text-xs md:text-sm text-gray-300">{formatDate(item.date)}</span>
            </>
          )}
        </div>
        <h3 className="text-sm md:text-base font-bold text-main mb-1 md:mb-2 line-clamp-2 group-hover:text-blue transition-colors">
          {item.title}
        </h3>
        {item.summary && (
          <p className="text-xs md:text-sm text-gray-400 line-clamp-2 leading-relaxed">
            {item.summary}
          </p>
        )}
      </div>
    </Wrapper>
  );
}
