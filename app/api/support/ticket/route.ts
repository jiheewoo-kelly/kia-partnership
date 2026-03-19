import { NextRequest, NextResponse } from "next/server";
import { submitSupportTicket } from "@/lib/notion";

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
