import { NextRequest, NextResponse } from "next/server";

const homepageMarkdown = `# Saju Prompt

Saju Prompt is available at https://saju-prompt.vercel.app.

Useful routes:
- /guide
- /guide/ai-saju-question-list
- /privacy
- /api/saju-question

The site helps create saju question prompts.
It does not persist user-entered inputs or generated prompts in its own database.
Prompt generation requests may be processed by the AI provider used by the service, so avoid sensitive data.
`;

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname !== "/") {
    return NextResponse.next();
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next();
  }

  if (!request.headers.get("accept")?.includes("text/markdown")) {
    return NextResponse.next();
  }

  return new NextResponse(homepageMarkdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
    },
  });
}

export const config = { matcher: "/" };
