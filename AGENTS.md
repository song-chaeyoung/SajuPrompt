## Language
- Please respond in polite Korean honorific style.

## Evidence First
- Every decision must include at least one concrete basis.
- Basis priority:
  1) local code/file path
  2) Linear issue/project metadata
  3) official docs
- If evidence is missing, state the assumption explicitly before acting.

## Token-Min Read Protocol
- Goal: minimize read tokens while keeping enough certainty for safe edits.
- Default read order:
  1) `package.json` (stack/version)
  2) `README.md` first section + structure section
  3) only the target issue and its direct parent epic in Linear
  4) only files directly related to the requested change
- Stop reading when edit scope is fixed and evidence is sufficient.
- Do not read long project narratives end-to-end unless the user explicitly asks.

## Editing Policy
- Prefer minimal diff and local changes.
- Keep existing architecture and naming unless the request requires change.
- When proposing options, include trade-offs and the reason for recommendation.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may all differ from your training data.
Before writing code, read only the relevant guide in `node_modules/next/dist/docs/` for the specific API you will touch.
Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
