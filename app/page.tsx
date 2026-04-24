import type { Metadata } from "next";

import { IntroPage } from "@/app/_pages/intro/ui/intro-page";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <IntroPage />;
}
