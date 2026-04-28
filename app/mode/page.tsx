import type { Metadata } from "next";

import { ModePage as ModeRoutePage } from "@/app/_pages/mode/ui/mode-page";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function ModePage() {
  return <ModeRoutePage />;
}
