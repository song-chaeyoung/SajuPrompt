import type { Metadata } from "next";

import { SajuPage as SajuRoutePage } from "@/app/_pages/saju/ui/saju-page";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function SajuPage() {
  return <SajuRoutePage />;
}
