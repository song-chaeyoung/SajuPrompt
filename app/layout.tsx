import type { Metadata } from "next";

import { getThemeInitializationScript } from "@/features/toggle-theme/config/theme";
import { ThemeToggle } from "@/features/toggle-theme/ui/theme-toggle";
import {
  getSiteUrl,
  SOCIAL_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/shared/config/site";

import "./globals.css";

const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();
const naverSiteVerification = process.env.NAVER_SITE_VERIFICATION?.trim();

const verification =
  googleSiteVerification || naverSiteVerification
    ? {
        ...(googleSiteVerification
          ? { google: googleSiteVerification }
          : {}),
        ...(naverSiteVerification
          ? {
              other: {
                "naver-site-verification": naverSiteVerification,
              },
            }
          : {}),
      }
    : undefined;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  other: {
    "google-adsense-account": "ca-pub-1178453465353818",
  },
  ...(verification ? { verification } : {}),
  keywords: [
    "사주질문지",
    "사주 질문 생성",
    "사주 프롬프트",
    "사주 질문 프롬프트",
    "ChatGPT 사주 질문",
    "ChatGPT 사주 프롬프트",
    "챗지피티 사주",
    "챗지피티 사주 질문 리스트",
    "AI 사주 질문",
    "AI 사주 질문 도우미",
    "사주 풀이 도우미",
    "궁합 질문",
    "Gemini 사주",
    "Claude 사주",
  ],
  openGraph: {
    title: SITE_NAME,
    description:
      "생년월일과 고민 맥락을 정리해 생성형 AI에 바로 사용할 사주 질문 프롬프트를 만듭니다.",
    type: "website",
    url: "/",
    locale: "ko_KR",
    siteName: SITE_NAME,
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "ChatGPT, Gemini, Claude에 붙여 넣을 AI 사주 질문 프롬프트를 자동으로 만들어 드립니다.",
    images: [SOCIAL_IMAGE],
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
        <script
          dangerouslySetInnerHTML={{ __html: themeInitializationScript }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
