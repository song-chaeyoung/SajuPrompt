import type { Metadata } from "next";
import Script from "next/script";

import { getThemeInitializationScript } from "@/features/toggle-theme/config/theme";
import { ThemeToaster } from "@/features/toggle-theme/ui/theme-toaster";
import { ThemeToggle } from "@/features/toggle-theme/ui/theme-toggle";

import "./globals.css";

const DEFAULT_SITE_URL = "http://localhost:3000";

function resolveMetadataBase() {
  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (vercelProductionUrl) {
    return `https://${vercelProductionUrl}`;
  }

  return DEFAULT_SITE_URL;
}

const socialImage = {
  url: "/metaimage.png",
  width: 1731,
  height: 909,
  alt: "사주질문지 공유 이미지",
};

export const metadata: Metadata = {
  metadataBase: new URL(resolveMetadataBase()),
  title: {
    default: "사주질문지",
    template: "%s | 사주질문지",
  },
  description:
    "사주 정보를 바탕으로 ChatGPT, Gemini, Claude에 바로 붙여 넣을 수 있는 맞춤형 질문문을 자동 생성합니다.",
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
      "사주 정보를 바탕으로 생성형 AI에 바로 사용할 수 있는 맞춤형 질문문을 생성합니다.",
    type: "website",
    url: "/",
    locale: "ko_KR",
    siteName: "사주질문지",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "사주질문지",
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
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wii8yp6pkx");
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeToggle />
        {children}
        <ThemeToaster />
      </body>
    </html>
  );
}
