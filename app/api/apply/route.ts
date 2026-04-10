import { NextRequest, NextResponse } from "next/server";
import { submitApplication, checkDuplicateApplication, verifyPortfolioId } from "@/lib/notion";

const PORTFOLIO_REQUIRED_MESSAGE =
  "포트폴리오사만 신청할 수 있습니다. 문의는 help@koreainvestment.ac 로 부탁드립니다.";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, contactName, email, perkId, perkName, partnerPageId, memo, portfolioId } = body;

    if (!companyName || !contactName || !email || !perkId) {
      return NextResponse.json(
        { error: "필수 항목을 모두 입력해주세요." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "올바른 이메일을 입력해주세요." },
        { status: 400 }
      );
    }

    if (!portfolioId || !(await verifyPortfolioId(portfolioId))) {
      return NextResponse.json(
        { error: PORTFOLIO_REQUIRED_MESSAGE, code: "PORTFOLIO_REQUIRED" },
        { status: 403 }
      );
    }

    if (partnerPageId) {
      const isDuplicate = await checkDuplicateApplication(portfolioId, partnerPageId);
      if (isDuplicate) {
        return NextResponse.json(
          { error: "이미 신청된 혜택입니다. 동일한 회사로 같은 혜택을 중복 신청할 수 없습니다." },
          { status: 409 }
        );
      }
    }

    await submitApplication({
      companyName,
      contactName,
      email,
      perkId,
      perkName: perkName || perkId,
      partnerPageId,
      memo,
      portfolioId: portfolioId || undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Application submission failed:", error);
    return NextResponse.json(
      { error: "신청 처리 중 오류가 발생했습니다.", detail: error?.message || String(error) },
      { status: 500 }
    );
  }
}
