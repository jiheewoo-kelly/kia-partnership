"use client";

import { useState } from "react";
import { PerkItem } from "@/lib/perks-data";
import CompanySearchInput from "@/components/CompanySearchInput";

interface ApplyModalProps {
  perk: PerkItem;
  onClose: () => void;
}

export default function ApplyModal({ perk, onClose }: ApplyModalProps) {
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    memo: "",
  });
  const [portfolioId, setPortfolioId] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          perkId: perk.id,
          perkName: perk.partnerName,
          partnerPageId: perk.notionPageId,
          portfolioId,
        }),
      });

      if (!res.ok) throw new Error("신청 실패");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
        {status === "success" ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-blue/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg
                className="w-7 h-7 text-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-main mb-2">신청 완료</h3>
            <p className="text-sm text-gray-400 mb-8 leading-relaxed">
              <strong className="text-main">{perk.partnerName}</strong> 혜택
              신청이 접수되었습니다.
              <br />
              담당자 확인 후 신청 방법을 안내드리겠습니다.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-2.5 bg-blue text-white rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors"
            >
              확인
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-lg font-bold text-main">혜택 신청</h2>
                <p className="text-sm text-gray-400 mt-1">
                  {perk.partnerName} — {perk.discount}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-300 hover:text-gray-500 transition-colors"
                aria-label="닫기"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-main mb-1.5">
                  회사명 *
                </label>
                <CompanySearchInput
                  value={form.companyName}
                  onChange={(name, id) => {
                    setForm({ ...form, companyName: name });
                    setPortfolioId(id);
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-main mb-1.5">
                  담당자 *
                </label>
                <input
                  type="text"
                  required
                  value={form.contactName}
                  onChange={(e) =>
                    setForm({ ...form, contactName: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue/40 transition-colors"
                  placeholder="담당자 이름"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-main mb-1.5">
                  이메일 *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue/40 transition-colors"
                  placeholder="email@company.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-main mb-1.5">
                  메모
                </label>
                <textarea
                  value={form.memo}
                  onChange={(e) =>
                    setForm({ ...form, memo: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue/40 transition-colors resize-none"
                  rows={3}
                  placeholder="추가 요청사항 (선택)"
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-red-500">
                  신청 중 오류가 발생했습니다. 다시 시도해주세요.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3 bg-blue text-white rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "신청 중..." : "신청하기"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
