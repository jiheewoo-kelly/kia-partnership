import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const NEWS_DB_ID = process.env.NOTION_NEWS_DB_ID!;
const PERKS_DB_ID = process.env.NOTION_PERKS_DB_ID!;
const APPLICATIONS_DB_ID = process.env.NOTION_APPLICATIONS_DB_ID!;
const ISSUE_TICKET_DB_ID = process.env.NOTION_ISSUE_TICKET_DB_ID!;
const VENUE_DB_ID = process.env.NOTION_VENUE_DB_ID!;

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

export async function verifyPortfolioId(portfolioId: string): Promise<boolean> {
  const portfoliosDbId = process.env.NOTION_PORTFOLIOS_DB_ID;
  if (!portfoliosDbId || !portfolioId) return false;
  try {
    const page: any = await notion.pages.retrieve({ page_id: portfolioId });
    const parentDbId: string | undefined = page?.parent?.database_id;
    if (!parentDbId) return false;
    const normalize = (id: string) => id.replace(/-/g, "").toLowerCase();
    return normalize(parentDbId) === normalize(portfoliosDbId);
  } catch (error) {
    console.error("Portfolio verification failed:", error);
    return false;
  }
}

async function findPortfolioCompany(companyName: string): Promise<string | null> {
  const portfoliosDbId = process.env.NOTION_PORTFOLIOS_DB_ID;
  if (!portfoliosDbId) return null;
  try {
    const search = await notion.databases.query({
      database_id: portfoliosDbId,
      filter: { property: "회사명", title: { contains: companyName } },
      page_size: 1,
    });
    return search.results.length > 0 ? search.results[0].id : null;
  } catch (error) {
    console.error("Portfolio lookup failed:", error);
    return null;
  }
}

export async function getPortfolioCompanies(): Promise<{ id: string; name: string }[]> {
  const portfoliosDbId = process.env.NOTION_PORTFOLIOS_DB_ID;
  if (!portfoliosDbId) return [];

  const results: { id: string; name: string }[] = [];
  let cursor: string | undefined = undefined;

  try {
    do {
      const response: any = await notion.databases.query({
        database_id: portfoliosDbId,
        filter: {
          and: [
            { property: "현황", select: { does_not_equal: "종료/엑싯" } },
            { property: "현황", select: { does_not_equal: "휴면" } },
          ],
        },
        sorts: [{ property: "회사명", direction: "ascending" }],
        page_size: 100,
        start_cursor: cursor,
      });

      for (const page of response.results) {
        const name = extractText((page as any).properties["회사명"]);
        if (name) results.push({ id: page.id, name });
      }

      cursor = response.next_cursor ?? undefined;
    } while (cursor);
  } catch (error) {
    console.error("Failed to fetch portfolio companies:", error);
  }

  return results;
}

export async function getNews(options?: {
  category?: string;
  pageSize?: number;
  startCursor?: string;
}): Promise<{ items: NewsItem[]; nextCursor: string | null }> {
  try {
    const categoryFilter = options?.category
      ? { property: "구분", select: { equals: options.category } }
      : null;
    const pageSize = options?.pageSize || 12;

    const toNewsItem = (page: any): NewsItem => ({
      id: page.id,
      title: extractText(page.properties["항목명"]),
      category: extractSelect(page.properties["구분"]),
      date: extractDate(page.properties["날짜"]),
      summary: extractText(page.properties["내용"]),
      thumbnail: extractFile(page.properties["포스터"]),
      link: extractUrl(page.properties["신청링크"]),
      status: extractSelect(page.properties["상태"]),
    });

    // 1) Coming Soon 항목을 먼저 전부 가져오기 (1페이지에서만)
    let comingSoonItems: NewsItem[] = [];
    if (!options?.startCursor) {
      const csFilter = categoryFilter
        ? { and: [{ property: "상태", select: { equals: "Coming Soon" } }, categoryFilter] }
        : { property: "상태", select: { equals: "Coming Soon" } };

      const csResponse = await notion.databases.query({
        database_id: NEWS_DB_ID,
        filter: csFilter,
        sorts: [{ property: "항목명", direction: "ascending" }],
      });
      comingSoonItems = csResponse.results.map(toNewsItem);
    }

    // 2) 나머지 항목 (모집 중 / 종료, 2026년 이후)
    const restBranches: any[] = [
      {
        and: [
          { property: "날짜", date: { on_or_after: "2026-01-01" } },
          { property: "상태", select: { equals: "모집 중" } },
          ...(categoryFilter ? [categoryFilter] : []),
        ],
      },
      {
        and: [
          { property: "날짜", date: { on_or_after: "2026-01-01" } },
          { property: "상태", select: { equals: "종료" } },
          ...(categoryFilter ? [categoryFilter] : []),
        ],
      },
    ];

    const restSize = Math.max(1, pageSize - comingSoonItems.length);
    const restResponse = await notion.databases.query({
      database_id: NEWS_DB_ID,
      page_size: restSize,
      start_cursor: options?.startCursor || undefined,
      filter: { or: restBranches },
      sorts: [{ property: "날짜", direction: "descending" }],
    });
    const restItems: NewsItem[] = restResponse.results.map(toNewsItem);

    const items = [...comingSoonItems, ...restItems];
    return { items, nextCursor: restResponse.next_cursor };
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
  portfolioId?: string;
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

  // Portfolios DB relation 연결 (선택된 ID 우선, 없으면 이름 검색)
  const portfolioId = data.portfolioId || await findPortfolioCompany(data.companyName);
  if (portfolioId) {
    properties["신청 회사"] = {
      relation: [{ id: portfolioId }],
    };
  }

  const response = await notion.pages.create({
    parent: { database_id: APPLICATIONS_DB_ID },
    properties,
  });

  return response;
}

export async function submitPRRequest(data: {
  companyName: string;
  articleTitle: string;
  articleContent: string;
  imageUrls: string[];
  requestedDate: string;
  contactName: string;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  portfolioId?: string;
}) {
  // 설명에 PR 관련 상세 정보를 모아서 기록
  const descParts = [
    `[기사 제목] ${data.articleTitle}`,
    `[배포 요청일] ${data.requestedDate}`,
    data.contactTitle ? `[담당자 직책] ${data.contactTitle}` : "",
    data.contactPhone ? `[담당자 연락처] ${data.contactPhone}` : "",
    "",
    data.articleContent,
  ].filter(Boolean);
  if (data.imageUrls.length > 0) {
    descParts.push("", "[첨부 이미지]", ...data.imageUrls);
  }
  const description = descParts.join("\n");

  // Notion rich_text 2000자 제한 대응
  const descChunks: { text: { content: string } }[] = [];
  for (let i = 0; i < description.length; i += 2000) {
    descChunks.push({ text: { content: description.slice(i, i + 2000) } });
  }

  const properties: Record<string, any> = {
    "티켓 제목": {
      title: [{ text: { content: `[PR 지원] ${data.companyName} - ${data.articleTitle}` } }],
    },
    "Issue Type": {
      select: { name: "PR 지원" },
    },
    설명: {
      rich_text: descChunks,
    },
    담당자명: {
      rich_text: [{ text: { content: data.contactName } }],
    },
    이메일: {
      email: data.contactEmail,
    },
    "해결 일자": {
      status: { name: "시작 전" },
    },
  };

  // Portfolios DB relation 연결 (선택된 ID 우선, 없으면 이름 검색)
  const portfolioId = data.portfolioId || await findPortfolioCompany(data.companyName);
  if (portfolioId) {
    properties["요청자"] = {
      relation: [{ id: portfolioId }],
    };
  }

  return await notion.pages.create({
    parent: { database_id: ISSUE_TICKET_DB_ID },
    properties,
  });
}

export async function submitSupportTicket(data: {
  companyName: string;
  requestContent: string;
  contactName: string;
  contactEmail: string;
  issueType: string;
  category?: string;
  portfolioId?: string;
}) {
  const properties: Record<string, any> = {
    "티켓 제목": {
      title: [{ text: { content: `[${data.category || data.issueType}] ${data.companyName}` } }],
    },
    "Issue Type": {
      select: { name: data.category || data.issueType },
    },
    설명: {
      rich_text: [{ text: { content: data.requestContent } }],
    },
    담당자명: {
      rich_text: [{ text: { content: data.contactName } }],
    },
    이메일: {
      email: data.contactEmail,
    },
    "해결 일자": {
      status: { name: "시작 전" },
    },
  };

  // Portfolios DB relation 연결 (선택된 ID 우선, 없으면 이름 검색)
  const portfolioId = data.portfolioId || await findPortfolioCompany(data.companyName);
  if (portfolioId) {
    properties["요청자"] = {
      relation: [{ id: portfolioId }],
    };
  }

  return await notion.pages.create({
    parent: { database_id: ISSUE_TICKET_DB_ID },
    properties,
  });
}

export async function checkDuplicateApplication(
  portfolioId: string,
  partnerPageId: string
): Promise<boolean> {
  try {
    const response = await notion.databases.query({
      database_id: APPLICATIONS_DB_ID,
      filter: {
        and: [
          { property: "신청 회사", relation: { contains: portfolioId } },
          { property: "신청 Perk (파트너)", relation: { contains: partnerPageId } },
        ],
      },
      page_size: 1,
    });
    return response.results.length > 0;
  } catch (error) {
    console.error("Duplicate check failed:", error);
    return false;
  }
}

export async function submitVenueReservation(data: {
  eventName: string;
  desiredDate: string;
  startTime: string;
  endTime: string;
  companyName: string;
  organizer: string;
  eventField: string;
  eventType: string;
  eventDescription: string;
  participants: string;
  isPublic: string;
  fee: string;
  website?: string;
  contactName: string;
  contactEmail: string;
  phone: string;
  portfolioId?: string;
}) {
  const properties: Record<string, any> = {
    "행사명": {
      title: [{ text: { content: data.eventName } }],
    },
    "예약 날짜": {
      date: { start: data.desiredDate },
    },
    "시작 시간": {
      rich_text: [{ text: { content: data.startTime } }],
    },
    "종료 시간": {
      rich_text: [{ text: { content: data.endTime } }],
    },
    "상태": {
      select: { name: "대기" },
    },
    "기업명": {
      rich_text: [{ text: { content: data.companyName } }],
    },
    "개최/주최자": {
      rich_text: [{ text: { content: data.organizer } }],
    },
    "행사 분야": {
      select: { name: data.eventField },
    },
    "행사 분류": {
      select: { name: data.eventType },
    },
    "행사 소개": {
      rich_text: [{ text: { content: data.eventDescription } }],
    },
    "참가자 구성": {
      rich_text: [{ text: { content: data.participants } }],
    },
    "외부 공개": {
      select: { name: data.isPublic },
    },
    "참가비": {
      rich_text: [{ text: { content: data.fee } }],
    },
    "담당자명": {
      rich_text: [{ text: { content: data.contactName } }],
    },
    "이메일": {
      email: data.contactEmail,
    },
    "연락처": {
      rich_text: [{ text: { content: data.phone } }],
    },
  };

  if (data.website) {
    properties["홈페이지"] = { url: data.website };
  }

  const portfolioId = data.portfolioId || await findPortfolioCompany(data.companyName);
  if (portfolioId) {
    properties["요청자"] = {
      relation: [{ id: portfolioId }],
    };
  }

  return await notion.pages.create({
    parent: { database_id: VENUE_DB_ID },
    properties,
  });
}

export async function getVenueReservations(): Promise<
  { title: string; start: string; end: string; date: string }[]
> {
  try {
    const response = await notion.databases.query({
      database_id: VENUE_DB_ID,
      filter: {
        property: "상태",
        select: { equals: "승인" },
      },
      sorts: [{ property: "예약 날짜", direction: "ascending" }],
    });

    return response.results.map((page: any) => {
      const props = page.properties;
      const date = extractDate(props["예약 날짜"]);
      const startTime = extractText(props["시작 시간"]);
      const endTime = extractText(props["종료 시간"]);
      const title = extractText(props["행사명"]);

      return {
        title,
        start: date && startTime ? `${date}T${startTime}:00` : date,
        end: date && endTime ? `${date}T${endTime}:00` : date,
        date,
      };
    });
  } catch (error) {
    console.error("Failed to fetch venue reservations:", error);
    return [];
  }
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
