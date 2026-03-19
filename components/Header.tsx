"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="select-none transition-all duration-500"
            aria-label="파트너십 홈으로"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-blue rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">KI</span>
              </div>
              <span className="font-bold text-main text-sm hidden sm:inline tracking-wide">
                한국투자액셀러레이터
              </span>
            </div>
          </Link>

          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="메인 내비게이션"
          >
            <Link
              href="/news"
              className="text-[13px] font-medium transition-colors duration-500 tracking-wide text-gray-500 hover:text-main"
            >
              소식
            </Link>
            <Link
              href="/perks"
              className="text-[13px] font-medium transition-colors duration-500 tracking-wide text-gray-500 hover:text-main"
            >
              Perks
            </Link>
            <Link
              href="/support"
              className="text-[13px] font-medium transition-colors duration-500 tracking-wide text-gray-500 hover:text-main"
            >
              Support
            </Link>
          </nav>

          <button
            type="button"
            aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={mobileOpen}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] rounded-none transition-colors hover:bg-main/5"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span
              className={`block h-px w-5 transition-all duration-300 bg-main ${
                mobileOpen ? "rotate-45 translate-y-[3px]" : ""
              }`}
            />
            <span
              className={`block h-px w-5 transition-all duration-300 bg-main ${
                mobileOpen ? "-rotate-45 -translate-y-[3px]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-80" : "max-h-0"
        }`}
        aria-hidden={!mobileOpen}
      >
        <nav className="flex flex-col px-4 py-3 gap-1 bg-white/98 backdrop-blur-md">
          <Link
            href="/news"
            className="text-left text-sm text-gray-600 hover:text-main font-medium py-3 border-b border-gray-50 transition-colors duration-200"
            onClick={() => setMobileOpen(false)}
          >
            소식
          </Link>
          <Link
            href="/perks"
            className="text-left text-sm text-gray-600 hover:text-main font-medium py-3 border-b border-gray-50 transition-colors duration-200"
            onClick={() => setMobileOpen(false)}
          >
            Perks
          </Link>
          <Link
            href="/support"
            className="text-left text-sm text-gray-600 hover:text-main font-medium py-3 transition-colors duration-200"
            onClick={() => setMobileOpen(false)}
          >
            Support
          </Link>
        </nav>
      </div>
    </header>
  );
}
