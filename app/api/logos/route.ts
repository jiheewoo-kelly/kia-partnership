import { NextResponse } from "next/server";
import { getPartnerLogos } from "@/lib/notion";
import { PERKS } from "@/lib/perks-data";

export const revalidate = 600; // ISR: 10분마다 재검증

export async function GET() {
  const pageIds = PERKS.map((p) => p.notionPageId).filter(
    (id): id is string => id !== null
  );

  try {
    const logos = await getPartnerLogos(pageIds);

    // perk id → logo URL 매핑
    const result: Record<string, string | null> = {};
    for (const perk of PERKS) {
      if (perk.notionPageId && logos[perk.notionPageId]) {
        result[perk.id] = logos[perk.notionPageId];
      } else {
        result[perk.id] = null;
      }
    }

    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200" },
    });
  } catch (error) {
    console.error("Failed to fetch logos:", error);
    return NextResponse.json({});
  }
}
