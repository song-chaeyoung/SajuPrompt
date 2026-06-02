import {
  getAbsoluteUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/shared/config/site";
import { JsonLd } from "@/shared/ui/json-ld";

export function SoftwareApplicationStructuredData() {
  const siteUrl = getAbsoluteUrl("/");
  const organizationId = `${siteUrl}#organization`;
  const websiteId = `${siteUrl}#website`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: SITE_NAME,
        alternateName: [
          "사주 질문지",
          "AI 사주 질문 도우미",
          "챗지피티 사주 질문 리스트",
        ],
        url: siteUrl,
        inLanguage: "ko-KR",
        publisher: {
          "@id": organizationId,
        },
      },
      {
        "@type": "Organization",
        "@id": organizationId,
        name: SITE_NAME,
        url: siteUrl,
      },
      {
        "@type": "SoftwareApplication",
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: siteUrl,
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
          "@id": organizationId,
        },
      },
    ],
  };

  return <JsonLd data={structuredData} />;
}
