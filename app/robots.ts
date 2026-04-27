import type { MetadataRoute } from "next";

import { getAbsoluteUrl } from "@/shared/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: ["OAI-SearchBot", "ChatGPT-User"],
        allow: "/",
      },
    ],
    sitemap: getAbsoluteUrl("/sitemap.xml"),
  };
}
