"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function CategoryFilter({
  categories,
  basePath,
}: {
  categories: string[];
  basePath: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("category") || "";

  const handleClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    params.delete("page");
    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleClick("")}
        className={`px-5 py-2 text-sm rounded-full border transition-colors ${
          !current
            ? "border-blue text-blue font-semibold"
            : "border-gray-200 text-gray-400 hover:border-blue/40 hover:text-main"
        }`}
      >
        전체
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleClick(cat)}
          className={`px-5 py-2 text-sm rounded-full border transition-colors ${
            current === cat
              ? "border-blue text-blue font-semibold"
              : "border-gray-200 text-gray-400 hover:border-blue/40 hover:text-main"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
