import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "파일을 선택해주세요." },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "파일 크기는 5MB를 초과할 수 없습니다." },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "JPG, PNG, WebP, GIF 파일만 업로드 가능합니다." },
        { status: 400 }
      );
    }

    const blob = await put(`support/pr/${Date.now()}-${file.name}`, file, {
      access: "public",
    });

    return NextResponse.json({ url: blob.url });
  } catch (error: any) {
    console.error("File upload failed:", error?.message, error?.stack);
    return NextResponse.json(
      {
        error: "파일 업로드 중 오류가 발생했습니다.",
        detail: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
