import {
  GUIDE_INDEX_DESCRIPTION,
  GUIDE_INDEX_MODIFIED_AT,
  GUIDE_INDEX_PATH,
  GUIDE_INDEX_TITLE,
  GUIDE_PAGES,
  type GuidePage,
} from "@/shared/config/guides";
import { getAbsoluteUrl, SITE_NAME } from "@/shared/config/site";
import { JsonLd } from "@/shared/ui/json-ld";

export function GuideIndexStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "홈",
            item: getAbsoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: GUIDE_INDEX_TITLE,
            item: getAbsoluteUrl(GUIDE_INDEX_PATH),
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: GUIDE_INDEX_TITLE,
        description: GUIDE_INDEX_DESCRIPTION,
        url: getAbsoluteUrl(GUIDE_INDEX_PATH),
        dateModified: GUIDE_INDEX_MODIFIED_AT,
        inLanguage: "ko-KR",
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: getAbsoluteUrl("/"),
        },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: GUIDE_PAGES.map((guide, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: guide.title,
            url: getAbsoluteUrl(guide.path),
          })),
        },
      },
    ],
  };

  return <JsonLd data={structuredData} />;
}

type GuideArticleStructuredDataProps = {
  guide: GuidePage;
};

export function GuideArticleStructuredData({
  guide,
}: GuideArticleStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "홈",
            item: getAbsoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: GUIDE_INDEX_TITLE,
            item: getAbsoluteUrl(GUIDE_INDEX_PATH),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: guide.title,
            item: getAbsoluteUrl(guide.path),
          },
        ],
      },
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.description,
        url: getAbsoluteUrl(guide.path),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": getAbsoluteUrl(guide.path),
        },
        datePublished: guide.publishedAt,
        dateModified: guide.modifiedAt,
        inLanguage: "ko-KR",
        author: {
          "@type": "Organization",
          name: SITE_NAME,
          url: getAbsoluteUrl("/"),
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: getAbsoluteUrl("/"),
        },
      },
    ],
  };

  return <JsonLd data={structuredData} />;
}
