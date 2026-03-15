"use client";

import { useState, useEffect } from "react";
import PerkCard from "@/components/PerkCard";
import ApplyModal from "@/components/ApplyModal";
import { PERKS, PERK_CATEGORIES, PerkItem } from "@/lib/perks-data";

export default function PerksPage() {
  const [category, setCategory] = useState("");
  const [selectedPerk, setSelectedPerk] = useState<PerkItem | null>(null);
  const [logos, setLogos] = useState<Record<string, string | null>>({});

  useEffect(() => {
    fetch("/api/logos")
      .then((res) => res.json())
      .then(setLogos)
      .catch(() => {});
  }, []);

  const filtered = category
    ? PERKS.filter((p) => p.category === category && p.status === "활성")
    : PERKS.filter((p) => p.status === "활성");

  const perksWithLogos = filtered.map((p) => ({
    ...p,
    logo: logos[p.id] || p.logo,
  }));

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-28">
        <p className="text-blue text-xs font-semibold tracking-[0.3em] uppercase mb-4">
          PARTNERSHIP PERKS
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-main mb-3">
          파트너 혜택
        </h1>
        <p className="text-gray-400 mb-12">
          한국투자액셀러레이터 파트너사의 다양한 혜택을 확인하고 신청하세요.
        </p>

        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setCategory("")}
            className={`px-5 py-2 text-sm rounded-full border transition-colors ${
              !category
                ? "border-blue text-blue font-semibold"
                : "border-gray-200 text-gray-400 hover:border-blue/40 hover:text-main"
            }`}
          >
            전체
          </button>
          {PERK_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 text-sm rounded-full border transition-colors ${
                category === cat
                  ? "border-blue text-blue font-semibold"
                  : "border-gray-200 text-gray-400 hover:border-blue/40 hover:text-main"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {perksWithLogos.map((item) => (
            <PerkCard key={item.id} item={item} onApply={setSelectedPerk} />
          ))}
        </div>

        {perksWithLogos.length === 0 && (
          <p className="text-center text-gray-300 py-20">
            해당 카테고리의 혜택이 없습니다.
          </p>
        )}

        {selectedPerk && (
          <ApplyModal
            perk={selectedPerk}
            onClose={() => setSelectedPerk(null)}
          />
        )}
      </div>
    </div>
  );
}
