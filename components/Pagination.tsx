"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({
  currentPage,
  hasNext,
  nextCursor,
  basePath,
}: {
  currentPage: number;
  hasNext: boolean;
  nextCursor?: string | null;
  basePath: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigate = (direction: "prev" | "next") => {
    const params = new URLSearchParams(searchParams.toString());
    // 커서 스택: 이전 페이지들의 커서를 콤마 구분으로 보관
    const cursorStack = params.get("cs")?.split(",").filter(Boolean) || [];

    if (direction === "next" && nextCursor) {
      // 현재 페이지의 커서를 스택에 push
      const currentCursor = params.get("cursor") || "";
      cursorStack.push(currentCursor);
      params.set("cs", cursorStack.join(","));
      params.set("cursor", nextCursor);
      params.set("page", String(currentPage + 1));
    } else if (direction === "prev" && currentPage > 1) {
      const prevCursor = cursorStack.pop() || "";
      if (cursorStack.length > 0) {
        params.set("cs", cursorStack.join(","));
      } else {
        params.delete("cs");
      }
      if (prevCursor) {
        params.set("cursor", prevCursor);
      } else {
        params.delete("cursor");
      }
      params.set("page", String(currentPage - 1));
    }

    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-3 mt-12">
      <button
        onClick={() => navigate("prev")}
        disabled={currentPage <= 1}
        className="px-5 py-2 text-sm border border-gray-200 rounded-full hover:border-blue/40 hover:text-blue disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        이전
      </button>
      <span className="text-sm text-gray-400 px-3">
        {currentPage} 페이지
      </span>
      <button
        onClick={() => navigate("next")}
        disabled={!hasNext}
        className="px-5 py-2 text-sm border border-gray-200 rounded-full hover:border-blue/40 hover:text-blue disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        다음
      </button>
    </div>
  );
}
