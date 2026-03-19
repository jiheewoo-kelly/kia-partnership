import { NextRequest, NextResponse } from "next/server";
import { submitPRRequest } from "@/lib/notion";

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
