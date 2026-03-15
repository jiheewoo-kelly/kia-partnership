"use client";

import { PerkItem } from "@/lib/perks-data";

export default function PerkCard({
  item,
  onApply,
}: {
  item: PerkItem;
  onApply: (perk: PerkItem) => void;
}) {
  return (
    <div className="bg-cream/60 border border-gray-100 rounded-2xl p-6 flex flex-col min-h-[360px] hover:border-blue/40 transition-colors">
      {/* 로고 */}
      <div className="h-16 flex items-center mb-5">
        {item.logo ? (
          <img
            src={item.logo}
            alt={item.partnerName}
            className="h-12 max-w-[144px] object-contain"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold text-gray-300">
              {item.partnerName[0]}
            </span>
          </div>
        )}
      </div>

      {/* 카테고리 + 할인 */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-blue text-sm font-semibold">{item.category}</span>
        {item.discount && (
          <>
            <span className="text-gray-200">·</span>
            <span className="text-sm font-semibold text-main">{item.discount}</span>
          </>
        )}
      </div>

      {/* 파트너명 */}
      <h3 className="text-base font-bold text-main mb-3">{item.partnerName}</h3>

      {/* 혜택 설명 */}
      <p className="text-gray-500 text-sm leading-relaxed mb-4">
        {item.description}
      </p>

      {/* 상세 혜택 */}
      <ul className="text-sm text-gray-600 space-y-1.5 mb-5 flex-1">
        {item.details.map((d, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-blue mt-0.5">•</span>
            <span>{d}</span>
          </li>
        ))}
      </ul>

      {/* 신청 버튼 */}
      <button
        onClick={() => onApply(item)}
        className="w-full py-2.5 border border-gray-200 text-sm font-medium text-main rounded-full hover:border-blue/40 hover:text-blue transition-colors"
      >
        신청하기
      </button>
    </div>
  );
}
