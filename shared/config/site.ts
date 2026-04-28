export const SITE_NAME = "사주질문지";

export const SITE_DESCRIPTION =
  "생년월일과 고민 맥락을 바탕으로 ChatGPT, Gemini, Claude에 붙여 넣을 AI 사주 질문 프롬프트를 자동 생성합니다.";

const LOCAL_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(siteUrl: string | undefined) {
  if (!siteUrl) {
    return undefined;
  }

  const trimmedSiteUrl = siteUrl.trim();
  if (!trimmedSiteUrl) {
    return undefined;
  }

  const siteUrlWithProtocol = /^https?:\/\//i.test(trimmedSiteUrl)
    ? trimmedSiteUrl
    : `https://${trimmedSiteUrl}`;

  try {
    return new URL(siteUrlWithProtocol).origin;
  } catch {
    return undefined;
  }
}

export function getSiteUrl() {
  const siteUrl =
    normalizeSiteUrl(process.env.SITE_URL) ??
    normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL);

  if (siteUrl) {
    return siteUrl;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SITE_URL or VERCEL_PROJECT_PRODUCTION_URL must be set to a valid URL in production.",
    );
  }

  return LOCAL_SITE_URL;
}

export function getAbsoluteUrl(pathname = "/") {
  return new URL(pathname, `${getSiteUrl()}/`).toString();
}
