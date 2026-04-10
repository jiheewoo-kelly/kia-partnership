import { NextRequest, NextResponse } from "next/server";
import { submitSupportTicket, verifyPortfolioId } from "@/lib/notion";

const PORTFOLIO_REQUIRED_MESSAGE =
  "포트폴리오사만 신청할 수 있습니다. 문의는 help@koreainvestment.ac 로 부탁드립니다.";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, requestContent, contactName, contactEmail, issueType, category, portfolioId } =
      body;

    if (!companyName || !requestContent || !contactName || !contactEmail || !issueType) {
      return NextResponse.json(
        { error: "필수 항목을 모두 입력해주세요." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
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

    await submitSupportTicket({
      companyName,
      requestContent,
      contactName,
      contactEmail,
      issueType,
      category,
      portfolioId: portfolioId || undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Support ticket submission failed:", error);
    return NextResponse.json(
      {
        error: "지원 요청 처리 중 오류가 발생했습니다.",
        detail: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
