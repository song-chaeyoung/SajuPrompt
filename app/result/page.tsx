import type { Metadata } from "next";

import { ResultPage as ResultRoutePage } from "@/app/_pages/result/ui/result-page";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function ResultPage() {
  return <ResultRoutePage />;
}
