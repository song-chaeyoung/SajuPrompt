import {
  getAbsoluteUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/shared/config/site";
import { JsonLd } from "@/shared/ui/json-ld";

export function SoftwareApplicationStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: getAbsoluteUrl("/"),
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    inLanguage: "ko-KR",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    featureList: [
      "생년월일과 출생 시간 기반 사주 질문 프롬프트 작성",
      "ChatGPT, Gemini, Claude에 붙여 넣을 질문문 생성",
      "연애운, 직업운 등 상황별 질문 맥락 정리",
    ],
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: getAbsoluteUrl("/"),
    },
  };

  return <JsonLd data={structuredData} />;
}
