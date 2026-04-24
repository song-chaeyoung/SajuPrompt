export const SITE_NAME = "사주질문지";

export const SITE_DESCRIPTION =
  "사주 정보를 바탕으로 ChatGPT, Gemini, Claude에 바로 붙여 넣을 수 있는 맞춤형 질문문을 자동 생성합니다.";

export const DEFAULT_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(siteUrl: string) {
  const trimmedSiteUrl = siteUrl.trim();
  const siteUrlWithProtocol = /^https?:\/\//i.test(trimmedSiteUrl)
    ? trimmedSiteUrl
    : `https://${trimmedSiteUrl}`;

  return new URL(siteUrlWithProtocol).origin;
}

export function getSiteUrl() {
  if (process.env.SITE_URL) {
    return normalizeSiteUrl(process.env.SITE_URL);
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  }

  return DEFAULT_SITE_URL;
}

export function getAbsoluteUrl(pathname = "/") {
  return new URL(pathname, `${getSiteUrl()}/`).toString();
}
