import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const guidesConfig = readFileSync(
  join(root, "shared", "config", "guides.ts"),
  "utf8",
);

const expectedGuides = [
  {
    exportName: "CHATGPT_SAJU_HOW_TO_GUIDE",
    path: "/guide/chatgpt-saju-how-to",
    title: "챗지피티로 사주 보는 법",
    pageFile: join(root, "app", "guide", "chatgpt-saju-how-to", "page.tsx"),
  },
  {
    exportName: "AI_SAJU_QUESTION_LIST_GUIDE",
    path: "/guide/ai-saju-question-list",
    title: "AI 사주 질문 리스트",
    pageFile: join(root, "app", "guide", "ai-saju-question-list", "page.tsx"),
  },
];

for (const guide of expectedGuides) {
  assert.match(guidesConfig, new RegExp(`export const ${guide.exportName}`));
  assert.match(guidesConfig, new RegExp(`path: "${guide.path}"`));
  assert.match(guidesConfig, new RegExp(`title: "${guide.title}`));
  assert.ok(existsSync(guide.pageFile), `${guide.path} page should exist`);
}

assert.match(
  guidesConfig,
  /GUIDE_PAGES = \[[\s\S]*CHATGPT_SAJU_HOW_TO_GUIDE[\s\S]*AI_SAJU_QUESTION_LIST_GUIDE[\s\S]*\]/,
);

const chatgptPromptPage = readFileSync(
  join(root, "app", "guide", "chatgpt-saju-prompt", "page.tsx"),
  "utf8",
);
assert.match(chatgptPromptPage, /RelatedGuideLinks/);
assert.match(chatgptPromptPage, /CHATGPT_SAJU_HOW_TO_GUIDE/);

const relatedGuideLinks = readFileSync(
  join(root, "app", "guide", "_components", "related-guide-links.tsx"),
  "utf8",
);
assert.match(relatedGuideLinks, /GUIDE_PAGES/);
assert.match(relatedGuideLinks, /guide\.path !== currentPath/);
