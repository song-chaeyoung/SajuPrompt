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

const aiQuestionListPage = readFileSync(
  join(root, "app", "guide", "ai-saju-question-list", "page.tsx"),
  "utf8",
);
assert.match(guidesConfig, /modifiedAt: "2026-06-02T00:00:00\+09:00"/);
assert.match(guidesConfig, /displayDate: "2026년 6월 2일"/);
assert.match(aiQuestionListPage, /챗지피티 사주 질문 리스트를 상황별로 골라 쓰세요/);
assert.match(aiQuestionListPage, /QUICK ANSWER/);
assert.match(aiQuestionListPage, /SUMMARY TABLE/);
assert.match(aiQuestionListPage, /상황별 챗지피티 사주 질문 요약/);
assert.match(aiQuestionListPage, /추천 질문 초점/);
assert.match(aiQuestionListPage, /챗지피티 사주 질문 리스트는 어떻게 써야 하나요\?/);
