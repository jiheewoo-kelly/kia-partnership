import { NextResponse } from "next/server";
import { getPortfolioCompanies } from "@/lib/notion";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const companies = await getPortfolioCompanies();
    return NextResponse.json(companies);
  } catch (error: any) {
    console.error("Failed to fetch portfolio companies:", error);
    return NextResponse.json(
      { error: "포트폴리오 목록 조회 실패", detail: error?.message || String(error) },
      { status: 500 }
    );
  }
}
