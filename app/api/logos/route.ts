import { NextResponse } from "next/server";
import { getPartnerLogos } from "@/lib/notion";
import { PERKS } from "@/lib/perks-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const pageIds = PERKS.map((p) => p.notionPageId).filter(
    (id): id is string => id !== null
  );

  try {
    const logos = await getPartnerLogos(pageIds);

    // perk id → logo URL 매핑
    const result: Record<string, string | null> = {};
    let hasAnyLogo = false;
    for (const perk of PERKS) {
      if (perk.notionPageId && logos[perk.notionPageId]) {
        result[perk.id] = logos[perk.notionPageId];
        hasAnyLogo = true;
      } else {
        result[perk.id] = null;
      }
    }

    const cacheHeader = hasAnyLogo
      ? "public, s-maxage=600, stale-while-revalidate=1200"
      : "no-store";
    return NextResponse.json(result, {
      headers: { "Cache-Control": cacheHeader },
    });
  } catch (error) {
    console.error("Failed to fetch logos:", error);
    return NextResponse.json({}, {
      headers: { "Cache-Control": "no-store" },
    });
  }
}
