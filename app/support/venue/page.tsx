"use client";

import { useState } from "react";
import Link from "next/link";
import CompanySearchInput from "@/components/CompanySearchInput";

export default function VenueSupportPage() {
  const [form, setForm] = useState({
    companyName: "",
    requestContent: "",
    contactName: "",
    contactEmail: "",
  });
  const [portfolioId, setPortfolioId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/support/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, issueType: "대관 지원", portfolioId }),
      });

      if (!res.ok) throw new Error("신청 실패");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue/40 transition-colors";

  if (status === "success") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center py-12">
          <div className="w-14 h-14 bg-blue/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-main mb-2">대관 지원 요청 완료</h3>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            대관 지원 요청이 접수되었습니다.
            <br />
            담당자 확인 후 안내드리겠습니다.
          </p>
          <Link
            href="/support"
            className="inline-block px-8 py-2.5 bg-blue text-white rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors"
          >
            돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-10">
        <Link href="/support" className="text-sm text-gray-400 hover:text-main transition-colors">
          ← Support
        </Link>
        <h1 className="text-2xl font-bold text-main mt-4 mb-2">대관 지원</h1>
        <p className="text-sm text-gray-400 leading-relaxed">
          행사 및 미팅을 위한 공간 대관을 요청해주세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-main mb-1.5">기업명 *</label>
          <CompanySearchInput
            value={form.companyName}
            onChange={(name, id) => {
              setForm({ ...form, companyName: name });
              setPortfolioId(id);
            }}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-main mb-1.5">요청 내용 *</label>
          <textarea
            required
            value={form.requestContent}
            onChange={(e) => setForm({ ...form, requestContent: e.target.value })}
            className={`${inputClass} resize-none`}
            rows={5}
            placeholder="대관 목적, 희망 일시, 예상 인원 등을 알려주세요"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-main mb-1.5">담당자 *</label>
          <input
            type="text"
            required
            value={form.contactName}
            onChange={(e) => setForm({ ...form, contactName: e.target.value })}
            className={inputClass}
            placeholder="담당자 이름"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-main mb-1.5">이메일 *</label>
          <input
            type="email"
            required
            value={form.contactEmail}
            onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            className={inputClass}
            placeholder="email@company.com"
          />
        </div>

        {status === "error" && (
          <p className="text-sm text-red-500">신청 중 오류가 발생했습니다. 다시 시도해주세요.</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full py-3.5 bg-blue text-white rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "제출 중..." : "대관 지원 요청하기"}
        </button>
      </form>
    </div>
  );
}
