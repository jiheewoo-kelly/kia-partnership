import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const NEWS_DB_ID = process.env.NOTION_NEWS_DB_ID!;
const PERKS_DB_ID = process.env.NOTION_PERKS_DB_ID!;
const APPLICATIONS_DB_ID = process.env.NOTION_APPLICATIONS_DB_ID!;

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  thumbnail: string | null;
  link: string | null;
  status: string;
}

export interface PerkItem {
  id: string;
  partnerName: string;
  category: string;
  description: string;
  logo: string | null;
  discount: string;
  expiryDate: string | null;
  status: string;
}

function extractText(property: any): string {
  if (!property) return "";
  if (property.type === "title") {
    return property.title?.map((t: any) => t.plain_text).join("") || "";
  }
  if (property.type === "rich_text") {
    return property.rich_text?.map((t: any) => t.plain_text).join("") || "";
  }
  return "";
}

function extractSelect(property: any): string {
  return property?.select?.name || "";
}

function extractDate(property: any): string {
  return property?.date?.start || "";
}

function extractUrl(property: any): string | null {
  return property?.url || null;
}

function extractFile(property: any): string | null {
  const files = property?.files;
  if (!files || files.length === 0) return null;
  const file = files[0];
  if (file.type === "external") return file.external.url;
  if (file.type === "file") return file.file.url;
  return null;
}

export async function getNews(options?: {
  category?: string;
  pageSize?: number;
  startCursor?: string;
}): Promise<{ items: NewsItem[]; nextCursor: string | null }> {
  try {
    const filter: any[] = [
      {
        property: "날짜",
        date: { on_or_after: "2026-01-01" },
      },
      {
        or: [
          { property: "상태", select: { equals: "모집 중" } },
          { property: "상태", select: { equals: "종료" } },
        ],
      },
    ];
    if (options?.category) {
      filter.push({
        property: "구분",
        select: { equals: options.category },
      });
    }

    const response = await notion.databases.query({
      database_id: NEWS_DB_ID,
      page_size: options?.pageSize || 12,
      start_cursor: options?.startCursor || undefined,
      filter: { and: filter },
      sorts: [{ property: "날짜", direction: "descending" }],
    });

    const items: NewsItem[] = response.results.map((page: any) => ({
      id: page.id,
      title: extractText(page.properties["항목명"]),
      category: extractSelect(page.properties["구분"]),
      date: extractDate(page.properties["날짜"]),
      summary: extractText(page.properties["내용"]),
      thumbnail: extractFile(page.properties["포스터"]),
      link: extractUrl(page.properties["신청링크"]),
      status: extractSelect(page.properties["상태"]),
    }));

    return { items, nextCursor: response.next_cursor };
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return { items: [], nextCursor: null };
  }
}

export async function getPerks(options?: {
  category?: string;
  pageSize?: number;
  startCursor?: string;
}): Promise<{ items: PerkItem[]; nextCursor: string | null }> {
  try {
    const filter: any[] = [
      { property: "상태", select: { equals: "활성" } },
    ];
    if (options?.category) {
      filter.push({
        property: "카테고리",
        select: { equals: options.category },
      });
    }

    const response = await notion.databases.query({
      database_id: PERKS_DB_ID,
      page_size: options?.pageSize || 12,
      start_cursor: options?.startCursor || undefined,
      filter: { and: filter },
      sorts: [{ property: "파트너사명", direction: "ascending" }],
    });

    const items: PerkItem[] = response.results.map((page: any) => ({
      id: page.id,
      partnerName: extractText(page.properties["파트너사명"]),
      category: extractSelect(page.properties["카테고리"]),
      description: extractText(page.properties["혜택 내용"]),
      logo: extractFile(page.properties["로고"]),
      discount: extractText(page.properties["할인율"]),
      expiryDate: extractDate(page.properties["유효기간"]),
      status: extractSelect(page.properties["상태"]),
    }));

    return { items, nextCursor: response.next_cursor };
  } catch (error) {
    console.error("Failed to fetch perks:", error);
    return { items: [], nextCursor: null };
  }
}

export async function submitApplication(data: {
  companyName: string;
  contactName: string;
  email: string;
  perkId: string;
  perkName: string;
  partnerPageId?: string;
  memo?: string;
}) {
  const properties: Record<string, any> = {
    제목: {
      title: [{ text: { content: `${data.companyName} → ${data.perkName}` } }],
    },
    담당자: {
      rich_text: [{ text: { content: data.contactName } }],
    },
    이메일: {
      email: data.email,
    },
    신청일: {
      date: { start: new Date().toISOString().split("T")[0] },
    },
    상태: {
      select: { name: "접수" },
    },
  };

  // Partners DB relation 연결
  if (data.partnerPageId) {
    properties["신청 Perk (파트너)"] = {
      relation: [{ id: data.partnerPageId }],
    };
  }

  // 메모
  if (data.memo) {
    properties["메모"] = {
      rich_text: [{ text: { content: data.memo } }],
    };
  }

  // Portfolios DB에서 회사명으로 검색하여 relation 연결
  try {
    const portfolioSearch = await notion.databases.query({
      database_id: process.env.NOTION_PORTFOLIOS_DB_ID || "",
      filter: { property: "회사명", title: { equals: data.companyName } },
      page_size: 1,
    });
    if (portfolioSearch.results.length > 0) {
      properties["신청 회사"] = {
        relation: [{ id: portfolioSearch.results[0].id }],
      };
    }
  } catch (error) {
    console.error("Portfolio lookup failed:", error);
  }

  const response = await notion.pages.create({
    parent: { database_id: APPLICATIONS_DB_ID },
    properties,
  });

  return response;
}

// Partners DB에서 파일과 미디어 속성의 로고 URL 가져오기
export async function getPartnerLogos(
  pageIds: string[]
): Promise<Record<string, string | null>> {
  const logos: Record<string, string | null> = {};

  await Promise.all(
    pageIds.map(async (pageId) => {
      try {
        const page = await notion.pages.retrieve({ page_id: pageId });
        const props = (page as any).properties;
        const filesProp = props["파일과 미디어"];
        logos[pageId] = extractFile(filesProp);
      } catch (error) {
        console.error(`Failed to fetch logo for ${pageId}:`, error);
        logos[pageId] = null;
      }
    })
  );

  return logos;
}
