import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();

const fromRoot = (...segments) => path.join(root, ...segments);

const readText = async (...segments) => {
  const filePath = fromRoot(...segments);
  assert.ok(existsSync(filePath), `${segments.join("/")} should exist`);
  return readFile(filePath, "utf8");
};

const collectStringValues = (value, values = []) => {
  if (typeof value === "string") {
    values.push(value);
    return values;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectStringValues(item, values);
    }
    return values;
  }

  if (value && typeof value === "object") {
    for (const item of Object.values(value)) {
      collectStringValues(item, values);
    }
  }

  return values;
};

test("robots.txt exposes agent content signals and sitemap", async () => {
  const robots = await readText("app", "robots.txt");
  const requiredLines = [
    "User-Agent: *",
    "Allow: /",
    "Content-Signal: search=yes, ai-input=yes, ai-train=no",
    "Sitemap: https://saju-prompt.vercel.app/sitemap.xml",
  ];

  for (const line of requiredLines) {
    assert.ok(robots.includes(line), `robots.txt should include ${line}`);
  }
});

test("llms.txt provides durable site, route, api, and privacy guidance", async () => {
  const llms = await readText("public", "llms.txt");

  for (const requiredText of [
    "https://saju-prompt.vercel.app",
    "/guide",
    "/privacy",
    "/api/saju-question",
  ]) {
    assert.ok(llms.includes(requiredText), `llms.txt should include ${requiredText}`);
  }

  assert.match(
    llms,
    /does not store/i,
    "llms.txt should include a privacy or safety note that user input is not stored",
  );
});

test("agent skill index references a skill markdown file with a matching sha256", async () => {
  const indexText = await readText("public", ".well-known", "agent-skills", "index.json");
  const index = JSON.parse(indexText);
  const entries = Array.isArray(index) ? index : index.skills;

  assert.ok(Array.isArray(entries), "agent skill index should be an array or expose a skills array");

  const skillPath = "/.well-known/agent-skills/saju-question-prompt/SKILL.md";
  const entry = entries.find((item) => collectStringValues(item).includes(skillPath));

  assert.ok(entry, `agent skill index should include ${skillPath}`);

  const skillMarkdown = await readText(
    "public",
    ".well-known",
    "agent-skills",
    "saju-question-prompt",
    "SKILL.md",
  );
  const expectedHash = createHash("sha256").update(skillMarkdown).digest("hex");

  assert.ok(
    collectStringValues(entry).includes(expectedHash),
    "agent skill index should include the actual SKILL.md sha256 hash",
  );
});

test("next config advertises agent resources with a Link header on the home route", async () => {
  const nextConfig = await readText("next.config.ts");

  for (const requiredText of [
    "headers",
    "Link",
    "/llms.txt",
    "/sitemap.xml",
    "/.well-known/agent-skills/index.json",
  ]) {
    assert.ok(nextConfig.includes(requiredText), `next.config.ts should include ${requiredText}`);
  }
});

test("proxy supports markdown negotiation for markdown-capable clients", async () => {
  const proxy = await readText("proxy.ts");

  for (const requiredText of ["text/markdown", "Vary", "Accept", "Content-Type"]) {
    assert.ok(proxy.includes(requiredText), `proxy.ts should include ${requiredText}`);
  }
});
