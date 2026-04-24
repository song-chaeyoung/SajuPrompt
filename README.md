# AI 사주 질문 설계기

사주 정보를 바탕으로 생성형 AI에 더 정확하게 질문할 수 있도록 질문문을 구조화해 주는 웹 서비스입니다.

사용자는 생년월일, 출생 시간, 출생지, 현재 상황, 질문 목적 등을 입력하고,  
계산된 사주 구조가 반영된 질문문을 ChatGPT, Gemini, Claude 등에 복사해 활용할 수 있습니다.

이 서비스는 최종 사주 해석을 직접 제공하는 서비스가 아니라,  
사용자가 AI에게 사주를 더 잘 물어볼 수 있도록 돕는 질문 설계 도구입니다.

## 주요 기능

- 내 사주 / 궁합 분석 모드 선택
- 이름, 성별, 생년월일, 출생 시간, 출생지, 양력/음력, 윤달 여부 등 사주 정보 입력
- 대한민국 광역자치단체 기준 출생지 선택 및 출생 시간 입력 시 시간 보정 반영
- 입력값을 바탕으로 양력일, 음력일, 년주·월주·일주·시주, 대운·세운·월운 등 사주 구조 계산
- 현재 상황 선택
  - 이직/진로, 연애/관계, 재물/소비, 올해 운세, 스트레스 등
- 질문 목적 선택
  - 전체 성향, 연애, 직업/재물, 주의 시기, 실천 조언 등
- 해석 스타일 선택
  - 균형형, 직설형, 공감형
- 추가 요청사항 선택 또는 직접 입력
- 생성형 AI에 붙여넣을 수 있는 질문문 생성
- 생성된 질문문 복사 및 ChatGPT, Gemini, Claude 열기

## 사용 흐름

1. 분석 모드를 선택합니다.
2. 내 정보와 필요한 경우 상대방 정보를 입력합니다.
3. 현재 상황, 질문 목적, 해석 스타일, 추가 요청사항을 입력합니다.
4. 최종 질문문을 생성합니다.
5. 생성된 질문문을 복사하거나 외부 AI 링크를 열어 활용합니다.

## AI 사용 방식

OpenAI API는 사주 해석 결과를 생성하기 위한 용도가 아니라,  
사용자의 입력값을 바탕으로 질문문을 자연스럽게 구성하고 다듬기 위해 사용됩니다.

사주 구조 계산은 서버에서 먼저 수행하고, OpenAI API에는 외부 AI에 붙여 넣을 최종 질문문 생성을 요청합니다.

최종 해석은 사용자가 생성된 질문문을 외부 생성형 AI에 직접 입력해 확인합니다.

## 기술 스택

- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS 4
- pnpm
- OpenAI API / OpenAI Node SDK
- [ssaju](https://github.com/golbin/ssaju)
- Zustand
- Radix UI / shadcn
- Sonner
- Feature-Sliced Design 지향

## 설치

```bash
pnpm install
```

## 실행

```bash
pnpm dev
```

개발 서버 실행 후 아래 주소에서 확인할 수 있습니다.

```txt
http://localhost:3000
```

## 환경 변수

`.env.example`을 기준으로 `.env.local` 파일을 생성해 주세요.

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1-mini
```

| 변수명           | 설명                                     |
| ---------------- | ---------------------------------------- |
| `OPENAI_API_KEY` | 질문문 생성을 위한 OpenAI API Key입니다. |
| `OPENAI_MODEL`   | 질문문 생성에 사용할 모델명입니다.       |

OpenAI 클라이언트는 아래 파일에서 생성됩니다.

```txt
shared/lib/openai/get-openai-client.ts
```

## 프로젝트 구조

```txt
app/
  api/saju-question/route.ts
  _pages/
    intro/ui/intro-page.tsx
    mode/ui/mode-page.tsx
    saju/ui/saju-page.tsx
    result/ui/result-page.tsx
  page.tsx
  mode/page.tsx
  saju/page.tsx
  result/page.tsx

widgets/
  saju-question-intro/
    config/intro-content.ts
    ui/saju-question-intro.tsx
  saju-question-mode/
    ui/saju-question-mode.tsx
  saju-question-form/
    ui/saju-question-form.tsx
  saju-question-result/
    ui/saju-question-result.tsx
  saju-question-step-shell/
    ui/saju-question-step-shell.tsx

features/
  plan-saju-question/
    model/
      saju-question-planner.store.ts
      use-plan-saju-question.ts
  select-analysis-mode/
    config/mode-options.ts
    ui/analysis-mode-selector.tsx
  fill-saju-question/
    config/goal-options.ts
    ui/
      goal-fields.tsx
      saju-question-fields.tsx
  toggle-theme/
    config/theme.ts
    lib/theme-store.ts
    ui/theme-toggle.tsx
    ui/theme-toaster.tsx
  view-generated-question/
    ui/generated-question-preview.tsx

entities/
  saju-profile/
    config/birth-profile-options.ts
    model/default-profile.ts
    ui/profile-fields.tsx

shared/
  config/form-steps.ts
  config/korean-birth-places.ts
  types/saju-question-form.ts
  ui/
    button.tsx
    card-sequence-loader.tsx
    dialog.tsx
    hero-orbit-ornament.tsx
    input.tsx
    label.tsx
    popover.tsx
    select.tsx
    sonner.tsx
    textarea.tsx
  lib/
    utils.ts
    toast.ts
    saju-question-form/
      birth-date-time.ts
      validation.ts
    manseryeok/
      derive-saju-context.ts
      types.ts
    openai/
      build-saju-prompt.ts
      get-openai-client.ts
```

## 품질 점검

```bash
pnpm lint
```
