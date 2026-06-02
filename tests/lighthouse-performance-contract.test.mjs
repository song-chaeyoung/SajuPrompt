import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();

const readSource = (...segments) => {
  const filePath = join(root, ...segments);
  assert.ok(existsSync(filePath), `${segments.join("/")} should exist`);
  return readFileSync(filePath, "utf8");
};

const stripComments = (source) =>
  source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

const getOpeningTag = (source, tagName, matcher) => {
  const tags = source.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) ?? [];
  const tag = tags.find(matcher);
  assert.ok(tag, `${tagName} opening tag should exist`);
  return tag;
};

test("root layout does not load Pretendard from a jsDelivr stylesheet", () => {
  const layoutSource = readSource("app", "layout.tsx");
  const jsDelivrPretendardStylesheet = /<link\b(?=[^>]*\brel=["']stylesheet["'])(?=[^>]*\bhref=["'][^"']*cdn\.jsdelivr\.net[^"']*pretendard)[^>]*>/i;

  assert.doesNotMatch(
    layoutSource,
    jsDelivrPretendardStylesheet,
    "app/layout.tsx should not load a render-blocking Pretendard stylesheet from jsDelivr",
  );
});

test("root layout does not globally load Microsoft Clarity", () => {
  const layoutSource = stripComments(readSource("app", "layout.tsx"));
  const globalClarityScript =
    /<Script\b(?=[^>]*\bid=["']microsoft-clarity["'])[^>]*>|\bclarity\.ms\b/i;

  assert.doesNotMatch(
    layoutSource,
    globalClarityScript,
    "app/layout.tsx should not globally load Microsoft Clarity or clarity.ms scripts",
  );
});

test("root layout does not globally load the toast runtime", () => {
  const layoutSource = stripComments(readSource("app", "layout.tsx"));

  assert.doesNotMatch(
    layoutSource,
    /ThemeToaster|theme-toaster|sonner/i,
    "app/layout.tsx should not load toast runtime on every page",
  );
});

test("toast runtime is scoped to interactive planner pages", () => {
  const sajuPageSource = readSource("app", "_pages", "saju", "ui", "saju-page.tsx");
  const resultPageSource = readSource(
    "app",
    "_pages",
    "result",
    "ui",
    "result-page.tsx",
  );

  for (const source of [sajuPageSource, resultPageSource]) {
    assert.match(source, /ThemeToaster/);
    assert.match(source, /features\/toggle-theme\/ui\/theme-toaster/);
  }
});

test("theme toggle avoids shared button dependencies in the global client bundle", () => {
  const themeToggleSource = stripComments(
    readSource("features", "toggle-theme", "ui", "theme-toggle.tsx"),
  );

  assert.doesNotMatch(
    themeToggleSource,
    /["']use client["']|useSyncExternalStore|useState|useEffect|onClick\s*=|@\/shared\/ui\/button|<Button\b|from "radix-ui"|class-variance-authority|tailwind-merge/,
    "ThemeToggle should avoid React client and shared Button dependencies because it is loaded globally",
  );
});

test("intro Gowun Batang heading font avoids preload fan-out", () => {
  const introSource = readSource(
    "widgets",
    "saju-question-intro",
    "ui",
    "saju-question-intro.tsx",
  );
  const gowunBatangInit = introSource.match(/Gowun_Batang\s*\(\s*{([\s\S]*?)}\s*\)/);

  assert.ok(gowunBatangInit, "Gowun_Batang font options should exist");
  assert.match(
    gowunBatangInit[1],
    /\bpreload\s*:\s*false\b/,
    "The Korean intro H1 font should not preload every generated unicode-range file",
  );
  assert.match(
    gowunBatangInit[1],
    /\bweight\s*:\s*["']700["']/,
    "The intro H1 uses font-bold, so Gowun Batang should only ship the 700 weight",
  );
});

test("intro h1 does not attach the hero enter animation class directly", () => {
  const introSource = readSource(
    "widgets",
    "saju-question-intro",
    "ui",
    "saju-question-intro.tsx",
  );
  const h1Tag = getOpeningTag(introSource, "h1", () => true);

  assert.doesNotMatch(
    h1Tag,
    /\bhero-enter\b/,
    "The H1 itself should not carry the hero-enter animation class",
  );
});

test("intro h1 does not attach animation delay inline", () => {
  const introSource = readSource(
    "widgets",
    "saju-question-intro",
    "ui",
    "saju-question-intro.tsx",
  );
  const h1Tag = getOpeningTag(introSource, "h1", () => true);

  assert.doesNotMatch(
    h1Tag,
    /\banimationDelay\b/,
    "The H1 itself should not delay LCP text rendering with inline animationDelay",
  );
});

test("global body background does not use fixed attachment", () => {
  const globalsSource = stripComments(readSource("app", "globals.css"));
  const bodyBlock = globalsSource.match(/\bbody\s*{([\s\S]*?)^\s*}/m);

  assert.ok(bodyBlock, "app/globals.css should include a body rule");
  assert.doesNotMatch(
    bodyBlock[1],
    /\bbackground-attachment\s*:\s*fixed\b/i,
    "body should not use background-attachment: fixed because it can cause scroll repaint cost",
  );
});

test("next config sets a cache header for public static assets", () => {
  const nextConfigSource = stripComments(readSource("next.config.ts"));
  const publicAssetCacheHeader =
    /source\s*:\s*["'][^"']*(?:png|jpe?g|webp|avif|svg|ico|woff2?|txt|xml|json|css|js)[^"']*["'][\s\S]*?key\s*:\s*["']Cache-Control["'][\s\S]*?value\s*:\s*["'][^"']*\bmax-age=\d+/i;

  assert.match(
    nextConfigSource,
    publicAssetCacheHeader,
    "next.config.ts should set a Cache-Control max-age header on public static asset routes",
  );
});
