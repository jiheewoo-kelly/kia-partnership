"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Company {
  id: string;
  name: string;
}

interface CompanySearchInputProps {
  value: string;
  onChange: (companyName: string, portfolioId: string | null) => void;
  placeholder?: string;
}

let cachedCompanies: Company[] | null = null;
let fetchPromise: Promise<Company[]> | null = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5분

function fetchCompanies(): Promise<Company[]> {
  if (cachedCompanies && Date.now() - cacheTime < CACHE_TTL) {
    return Promise.resolve(cachedCompanies);
  }
  cachedCompanies = null;
  fetchPromise = null;

  fetchPromise = fetch("/api/portfolios")
    .then((res) => res.json())
    .then((data: Company[]) => {
      cachedCompanies = data;
      cacheTime = Date.now();
      return data;
    })
    .catch(() => {
      fetchPromise = null;
      return [];
    });
  return fetchPromise;
}

export default function CompanySearchInput({
  value,
  onChange,
  placeholder = "포트폴리오사 이름",
}: CompanySearchInputProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    fetchCompanies().then(setCompanies);
  }, []);

  // 외부 클릭 시 닫기
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = value.trim()
    ? companies.filter((c) => c.name.toLowerCase().includes(value.toLowerCase()))
    : companies;

  const select = useCallback(
    (company: Company) => {
      onChange(company.name, company.id);
      setOpen(false);
      setHighlightIndex(-1);
    },
    [onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown") {
        setOpen(true);
        setHighlightIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightIndex >= 0 && highlightIndex < filtered.length) {
          select(filtered[highlightIndex]);
        }
        break;
      case "Escape":
        setOpen(false);
        setHighlightIndex(-1);
        break;
    }
  };

  // 스크롤 따라가기
  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightIndex]);

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        required
        value={value}
        onChange={(e) => {
          onChange(e.target.value, null);
          setOpen(true);
          setHighlightIndex(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue/40 transition-colors"
        placeholder={placeholder}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-[60] left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg"
        >
          {filtered.map((c, i) => (
            <li
              key={c.id}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                i === highlightIndex ? "bg-blue/5 text-blue" : "text-main hover:bg-gray-50"
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                select(c);
              }}
              onMouseEnter={() => setHighlightIndex(i)}
            >
              {c.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
