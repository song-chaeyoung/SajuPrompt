import type { Metadata } from "next";

import { IntroPage } from "@/app/_pages/intro/ui/intro-page";

export const metadata: Metadata = {
  title: "AI 사주 질문 도우미",
  description:
    "ChatGPT, Gemini, Claude에 붙여 넣을 사주 질문 프롬프트를 생년월일과 고민 맥락에 맞춰 정리합니다.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <IntroPage />;
}
