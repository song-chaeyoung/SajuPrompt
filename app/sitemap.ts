import type { MetadataRoute } from "next";

import { getAbsoluteUrl } from "@/shared/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: getAbsoluteUrl("/"),
    },
    {
      url: getAbsoluteUrl("/guide/chatgpt-saju-prompt"),
    },
    {
      url: getAbsoluteUrl("/privacy"),
    },
  ];
}
