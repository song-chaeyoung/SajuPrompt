import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "사주질문지",
    template: "%s | 사주질문지",
  },
  description:
    "사주 정보와 현재 상황을 바탕으로 ChatGPT, Gemini, Claude에 바로 붙여넣을 수 있는 맞춤형 사주 질문문을 자동 생성합니다.",
  applicationName: "사주질문지",
  keywords: [
    "사주질문지",
    "사주 질문 생성",
    "사주 프롬프트",
    "궁합 질문",
    "ChatGPT 사주",
    "Gemini 사주",
    "Claude 사주",
  ],
  openGraph: {
    title: "사주질문지",
    description:
      "사주 정보와 현재 상황을 바탕으로 생성형 AI에 바로 사용할 수 있는 맞춤형 질문문을 생성합니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "사주질문지",
  },
  twitter: {
    card: "summary_large_image",
    title: "사주질문지",
    description:
      "내 사주/궁합 정보를 입력하면 생성형 AI에 바로 붙여넣을 질문문을 자동으로 만들어드립니다.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
