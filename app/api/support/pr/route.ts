import { NextRequest, NextResponse } from "next/server";
import { submitPRRequest, verifyPortfolioId } from "@/lib/notion";

const PORTFOLIO_REQUIRED_MESSAGE =
  "포트폴리오사만 신청할 수 있습니다. 문의는 help@koreainvestment.ac 로 부탁드립니다.";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companyName,
      articleTitle,
      articleContent,
      imageUrls,
      requestedDate,
      contactName,
      contactTitle,
      contactEmail,
      contactPhone,
      portfolioId,
    } = body;

    if (
      !companyName ||
      !articleTitle ||
      !articleContent ||
      !requestedDate ||
      !contactName ||
      !contactEmail
    ) {
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

    await submitPRRequest({
      companyName,
      articleTitle,
      articleContent,
      imageUrls: imageUrls || [],
      requestedDate,
      contactName,
      contactTitle: contactTitle || "",
      contactEmail,
      contactPhone: contactPhone || "",
      portfolioId: portfolioId || undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PR request submission failed:", error);
    return NextResponse.json(
      {
        error: "PR 요청 처리 중 오류가 발생했습니다.",
        detail: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
