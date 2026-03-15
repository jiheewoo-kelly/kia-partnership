import { NextRequest, NextResponse } from "next/server";
import { submitApplication } from "@/lib/notion";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, contactName, email, perkId, perkName, partnerPageId, memo } = body;

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

    await submitApplication({
      companyName,
      contactName,
      email,
      perkId,
      perkName: perkName || perkId,
      partnerPageId,
      memo,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Application submission failed:", error);
    return NextResponse.json(
      { error: "신청 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
