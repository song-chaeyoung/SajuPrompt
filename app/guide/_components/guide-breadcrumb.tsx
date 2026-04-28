import Link from "next/link";

import { GUIDE_INDEX_PATH, GUIDE_INDEX_TITLE } from "@/shared/config/guides";

type GuideBreadcrumbProps = {
  currentTitle?: string;
};

export function GuideBreadcrumb({ currentTitle }: GuideBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex flex-wrap items-center gap-2 type-body-sm text-muted-foreground"
    >
      <Link
        href="/"
        className="font-semibold text-foreground underline-offset-4 hover:underline"
      >
        홈
      </Link>
      <span aria-hidden>/</span>
      {currentTitle ? (
        <>
          <Link
            href={GUIDE_INDEX_PATH}
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            가이드
          </Link>
          <span aria-hidden>/</span>
          <span>{currentTitle}</span>
        </>
      ) : (
        <span>{GUIDE_INDEX_TITLE}</span>
      )}
    </nav>
  );
}
