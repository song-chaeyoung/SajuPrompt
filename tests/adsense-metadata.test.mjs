import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const rootLayoutSource = readFileSync(
  join(root, "app", "layout.tsx"),
  "utf8",
);

assert.match(rootLayoutSource, /other:\s*{/);
assert.match(rootLayoutSource, /"google-adsense-account":\s*"ca-pub-1178453465353818"/);
