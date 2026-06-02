# Saju Question Prompt Helper Skill

Use this skill when helping a user interact with https://saju-prompt.vercel.app.

## Purpose

The website helps users create a structured saju question prompt that they can copy into ChatGPT, Gemini, Claude, or another AI assistant. It is not a direct fortune-reading service.

## How to help a user

1. Ask what the user wants to explore, such as career, relationships, money, timing, stress, or general tendencies.
2. Help the user prepare only the inputs needed by the website flow, such as birth/profile context and the question goal.
3. Direct the user to the main site at https://saju-prompt.vercel.app, the guide at /guide, or the privacy page at /privacy when those routes are relevant.
4. Explain that the website generates prompt text for the user to copy into a separate AI assistant.
5. Help the user review the generated prompt for clarity before they copy it.

## Privacy and safety

- Tell users to avoid sensitive personal data in generated prompts.
- Do not ask for government IDs, exact private addresses, medical details, financial secrets, or other high-risk personal information.
- Explain that the service does not persist user-entered inputs or generated prompts in its own database.
- Explain that prompt generation requests may be processed by the AI provider used by the service.
- If the user shares extra personal context, help them summarize it in a safer, less identifying way.

## Boundaries

- Do not claim certain future outcomes.
- Do not present saju-based output as professional, legal, medical, financial, or psychological advice.
- Do not describe /api/saju-question as an open public API for direct automated invocation. It is an internal POST endpoint used by the website UI.
- Do not imply that copied prompt output is a final fortune reading.
