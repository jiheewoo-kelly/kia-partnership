"use client";

import { useState } from "react";
import Link from "next/link";
import CompanySearchInput from "@/components/CompanySearchInput";

export default function GeneralSupportPage() {
  const [form, setForm] = useState({
    companyName: "",
    category: "",
    requestContent: "",
    contactName: "",
    contactEmail: "",
  });
  const [portfolioId, setPortfolioId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "forbidden">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioId) {
      setStatus("forbidden");
      return;
    }
    setStatus("loading");

    try {
      const res = await fetch("/api/support/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, issueType: "기타 지원", category: form.category, portfolioId }),
      });

      if (res.status === 403) {
        setStatus("forbidden");
        return;
      }
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
          <h3 className="text-lg font-bold text-main mb-2">지원 요청 완료</h3>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            지원 요청이 접수되었습니다.
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
        <h1 className="text-2xl font-bold text-main mt-4 mb-2">기타 지원</h1>
        <p className="text-sm text-gray-400 leading-relaxed">
          PR, 대관 외 기타 지원이 필요하시면 요청해주세요.
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
              if (status === "forbidden") setStatus("idle");
            }}
          />
          {form.companyName && !portfolioId && (
            <p className="mt-1.5 text-xs text-gray-400">
              목록에서 회사를 선택해주세요.
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-main mb-1.5">카테고리 *</label>
          <select
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={inputClass}
          >
            <option value="" disabled>요청 유형을 선택해주세요</option>
            <option value="대기업 연결">대기업 연결</option>
            <option value="투자 연계">투자 연계</option>
            <option value="인재 채용 지원">인재 채용 지원</option>
            <option value="법률/회계 자문">법률/회계 자문</option>
            <option value="글로벌 진출 지원">글로벌 진출 지원</option>
            <option value="기술 자문">기술 자문</option>
            <option value="마케팅/홍보 지원">마케팅/홍보 지원</option>
            <option value="기타">기타</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-main mb-1.5">요청 내용 *</label>
          <textarea
            required
            value={form.requestContent}
            onChange={(e) => setForm({ ...form, requestContent: e.target.value })}
            className={`${inputClass} resize-none`}
            rows={5}
            placeholder="지원이 필요한 내용을 상세히 작성해주세요"
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

        {status === "forbidden" && (
          <p className="text-sm text-red-500">
            포트폴리오사만 신청할 수 있습니다. 문의는{" "}
            <a href="mailto:help@koreainvestment.ac" className="underline">
              help@koreainvestment.ac
            </a>
            {" "}로 부탁드립니다.
          </p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-500">신청 중 오류가 발생했습니다. 다시 시도해주세요.</p>
        )}

        <button
          type="submit"
          disabled={status === "loading" || !portfolioId}
          className="w-full py-3.5 bg-blue text-white rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "제출 중..." : "지원 요청하기"}
        </button>
      </form>
    </div>
  );
}
