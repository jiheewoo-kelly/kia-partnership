"use client";

import { useState } from "react";
import Link from "next/link";
import CompanySearchInput from "@/components/CompanySearchInput";

export default function PRSupportPage() {
  const [form, setForm] = useState({
    companyName: "",
    articleTitle: "",
    articleContent: "",
    requestedDate: "",
    contactName: "",
    contactTitle: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [portfolioId, setPortfolioId] = useState<string | null>(null);
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("파일 크기는 5MB를 초과할 수 없습니다.");
        return;
      }
      if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
        setErrorMsg("JPG, PNG, WebP, GIF 파일만 업로드 가능합니다.");
        return;
      }
    }

    setErrorMsg("");
    const newImages = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const img of images) {
      const formData = new FormData();
      formData.append("file", img.file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || errData.error || "이미지 업로드 실패");
      }
      const data = await res.json();
      urls.push(data.url);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    if (images.length === 0) {
      setErrorMsg("기사 이미지를 1장 이상 첨부해주세요.");
      setStatus("error");
      return;
    }

    try {
      const imageUrls = await uploadImages();

      const res = await fetch("/api/support/pr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageUrls, portfolioId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || data.error || "신청 실패");
      }
      setStatus("success");
    } catch (err: any) {
      setErrorMsg(err.message || "신청 중 오류가 발생했습니다.");
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
          <h3 className="text-lg font-bold text-main mb-2">PR 지원 요청 완료</h3>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            보도자료 지원 요청이 접수되었습니다.
            <br />
            담당자 검토 후 진행 상황을 안내드리겠습니다.
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
        <h1 className="text-2xl font-bold text-main mt-4 mb-2">PR 지원 요청</h1>
        <p className="text-sm text-gray-400 leading-relaxed">
          보도자료 작성 및 배포를 위한 정보를 입력해주세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-cream/60 border border-gray-100 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-bold text-main">기사 정보</h2>
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
            <label className="block text-xs font-semibold text-main mb-1.5">기사 제목 *</label>
            <input
              type="text"
              required
              value={form.articleTitle}
              onChange={(e) => setForm({ ...form, articleTitle: e.target.value })}
              className={inputClass}
              placeholder="보도자료 제목"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-main mb-1.5">기사 내용 *</label>
            <textarea
              required
              value={form.articleContent}
              onChange={(e) => setForm({ ...form, articleContent: e.target.value })}
              className={`${inputClass} resize-none`}
              rows={8}
              placeholder="보도자료 본문 내용을 입력해주세요"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-main mb-1.5">배포 요청일 *</label>
            <input
              type="date"
              required
              value={form.requestedDate}
              onChange={(e) => setForm({ ...form, requestedDate: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-main mb-1.5">
              기사 이미지 * <span className="font-normal text-gray-400">(최대 5MB, JPG/PNG/WebP/GIF)</span>
            </label>
            <div className="flex flex-wrap gap-3 mb-3">
              {images.map((img, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
                  <img src={img.preview} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:border-blue/40 cursor-pointer transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              이미지 추가
              <input type="file" accept="image/*" multiple onChange={handleImageAdd} className="hidden" />
            </label>
          </div>
        </div>

        <div className="bg-cream/60 border border-gray-100 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-bold text-main">담당자 정보</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-main mb-1.5">이름 *</label>
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
              <label className="block text-xs font-semibold text-main mb-1.5">직책</label>
              <input
                type="text"
                value={form.contactTitle}
                onChange={(e) => setForm({ ...form, contactTitle: e.target.value })}
                className={inputClass}
                placeholder="직책"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
            <div>
              <label className="block text-xs font-semibold text-main mb-1.5">연락처 *</label>
              <input
                type="tel"
                required
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                className={inputClass}
                placeholder="010-0000-0000"
              />
            </div>
          </div>
        </div>

        {(status === "error" || errorMsg) && (
          <p className="text-sm text-red-500">{errorMsg || "신청 중 오류가 발생했습니다. 다시 시도해주세요."}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full py-3.5 bg-blue text-white rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "제출 중..." : "PR 지원 요청하기"}
        </button>
      </form>
    </div>
  );
}
