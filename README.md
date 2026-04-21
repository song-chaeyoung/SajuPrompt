# AI Saju Question Designer

Initial setup for an App Router-based Next.js project.

## Install

```bash
pnpm install
```

## Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create `.env.local` from `.env.example`.

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1-mini
```

`OPENAI_API_KEY` is used only on the server via
`shared/lib/openai/get-openai-client.ts`.

## Current Structure (FSD-oriented)

```txt
app/
  _pages/home/ui/home-page.tsx
widgets/
  saju-question-planner/ui/saju-question-planner.tsx
features/
  saju-question-form/model/saju-question-form.store.ts
entities/
  saju-profile/model/default-profile.ts
shared/
  config/form-steps.ts
  types/saju-question-form.ts
  lib/openai/get-openai-client.ts
```

## Quality Check

```bash
pnpm lint
```
