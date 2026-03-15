"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({
  currentPage,
  hasNext,
  basePath,
}: {
  currentPage: number;
  hasNext: boolean;
  basePath: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigate = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-3 mt-12">
      <button
        onClick={() => navigate(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-5 py-2 text-sm border border-gray-200 rounded-full hover:border-blue/40 hover:text-blue disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        이전
      </button>
      <span className="text-sm text-gray-400 px-3">
        {currentPage} 페이지
      </span>
      <button
        onClick={() => navigate(currentPage + 1)}
        disabled={!hasNext}
        className="px-5 py-2 text-sm border border-gray-200 rounded-full hover:border-blue/40 hover:text-blue disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        다음
      </button>
    </div>
  );
}
