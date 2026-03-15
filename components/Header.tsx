"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-blue rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">KI</span>
          </div>
          <span className="font-bold text-main text-sm hidden sm:inline">
            한국투자액셀러레이터
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/news"
            className="text-sm text-gray-400 hover:text-main transition-colors"
          >
            소식
          </Link>
          <Link
            href="/perks"
            className="text-sm text-gray-400 hover:text-main transition-colors"
          >
            Perks
          </Link>
        </nav>

        <button
          className="md:hidden p-2 text-gray-400"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="메뉴 열기"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="flex flex-col px-6 py-4 gap-4">
            <Link
              href="/news"
              className="text-sm text-gray-400 hover:text-main"
              onClick={() => setMobileOpen(false)}
            >
              소식
            </Link>
            <Link
              href="/perks"
              className="text-sm text-gray-400 hover:text-main"
              onClick={() => setMobileOpen(false)}
            >
              Perks
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
