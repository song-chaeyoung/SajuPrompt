import type { Metadata } from "next";

import { getThemeInitializationScript } from "@/features/toggle-theme/config/theme";
import { ThemeToaster } from "@/features/toggle-theme/ui/theme-toaster";
import { ThemeToggle } from "@/features/toggle-theme/ui/theme-toggle";
import {
  getSiteUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/shared/config/site";

import "./globals.css";

const socialImage = {
  url: "/metaimage.png",
  width: 1731,
  height: 909,
  alt: "사주질문지 공유 이미지",
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
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
    title: SITE_NAME,
    description:
      "사주 정보를 바탕으로 생성형 AI에 바로 사용할 수 있는 맞춤형 질문문을 생성합니다.",
    type: "website",
    url: "/",
    locale: "ko_KR",
    siteName: SITE_NAME,
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "사주와 궁합 정보를 입력하면 생성형 AI에 바로 붙여 넣을 질문문을 자동으로 만들어 드립니다.",
    images: [socialImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeInitializationScript = getThemeInitializationScript();

  return (
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <script
          dangerouslySetInnerHTML={{ __html: themeInitializationScript }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeToggle />
        {children}
        <ThemeToaster />
      </body>
    </html>
  );
}
