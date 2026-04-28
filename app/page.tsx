import type { Metadata } from "next";

import { IntroPage } from "@/app/_pages/intro/ui/intro-page";
import { SoftwareApplicationStructuredData } from "@/shared/ui/software-application-structured-data";

export const metadata: Metadata = {
  title: "AI 사주 질문 도우미",
  description:
    "생년월일, 출생 시간, 고민을 입력하면 ChatGPT, Gemini, Claude에 붙여 넣을 AI 사주 질문 프롬프트를 단계별로 정리합니다.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <SoftwareApplicationStructuredData />
      <IntroPage />
    </>
  );
}
