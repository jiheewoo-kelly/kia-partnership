import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "파트너십 - 한국투자액셀러레이터",
  description:
    "한국투자액셀러레이터 포트폴리오사를 위한 파트너십 프로그램. 클라우드, 마케팅, 법률 등 다양한 파트너 혜택을 확인하세요.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-pretendard antialiased bg-white text-main min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
