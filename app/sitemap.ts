import type { MetadataRoute } from "next";

import {
  GUIDE_INDEX_MODIFIED_AT,
  GUIDE_INDEX_PATH,
  GUIDE_PAGES,
} from "@/shared/config/guides";
import { getAbsoluteUrl } from "@/shared/config/site";

const HOME_LAST_MODIFIED = "2026-04-27T00:00:00+09:00";
const PRIVACY_LAST_MODIFIED = "2026-04-27T00:00:00+09:00";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: getAbsoluteUrl("/"),
      lastModified: HOME_LAST_MODIFIED,
    },
    {
      url: getAbsoluteUrl(GUIDE_INDEX_PATH),
      lastModified: GUIDE_INDEX_MODIFIED_AT,
    },
    ...GUIDE_PAGES.map((guide) => ({
      url: getAbsoluteUrl(guide.path),
      lastModified: guide.modifiedAt,
    })),
    {
      url: getAbsoluteUrl("/privacy"),
      lastModified: PRIVACY_LAST_MODIFIED,
    },
  ];
}
