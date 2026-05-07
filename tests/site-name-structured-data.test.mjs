import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const structuredDataSource = readFileSync(
  join(root, "shared", "ui", "software-application-structured-data.tsx"),
  "utf8",
);

assert.match(structuredDataSource, /"@type": "WebSite"/);
assert.match(structuredDataSource, /name: SITE_NAME/);
assert.match(structuredDataSource, /alternateName/);
assert.match(structuredDataSource, /"AI 사주 질문 도우미"/);
