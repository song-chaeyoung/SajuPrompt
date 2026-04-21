# AI 사주 질문 설계기

사주 정보를 바탕으로 생성형 AI에 더 정확하게 질문할 수 있도록 질문문을 구조화해 주는 웹 서비스입니다.

사용자는 생년월일, 출생 시간, 현재 상황, 질문 목적 등을 입력하고,  
생성된 질문문을 ChatGPT, Gemini, Claude 등에 복사해 활용할 수 있습니다.

이 서비스는 사주를 직접 해석하는 서비스가 아니라,  
사용자가 AI에게 사주를 더 잘 물어볼 수 있도록 돕는 질문 설계 도구입니다.

## 주요 기능

- 내 사주 / 궁합 분석 모드 선택
- 생년월일, 출생 시간, 양력/음력, 성별 등 사주 정보 입력
- 현재 상황 선택
  - 썸, 연애 중, 이별 후, 재회 고민, 진로 고민 등
- 질문 목적 선택
  - 연애, 궁합, 직업, 재물, 운세, 인간관계 등
- 해석 스타일 선택
  - 쉬운 설명, 현실 조언, 감정 중심, 분석 중심 등
- 추가 요구사항 입력
- 생성형 AI에 붙여넣을 수 있는 질문문 생성

## 사용 흐름

1. 분석 모드를 선택합니다.
2. 사주 정보를 입력합니다.
3. 현재 상황과 질문 목적을 선택합니다.
4. 원하는 해석 스타일과 추가 요구사항을 입력합니다.
5. 최종 질문문을 생성합니다.
6. 생성된 질문문을 복사해 생성형 AI에 붙여넣습니다.

## AI 사용 방식

OpenAI API는 사주 해석 결과를 생성하기 위한 용도가 아니라,  
사용자의 입력값을 바탕으로 질문문을 자연스럽게 구성하고 다듬기 위해 사용됩니다.

최종 해석은 사용자가 생성된 질문문을 외부 생성형 AI에 직접 입력해 확인합니다.

## 기술 스택

- Next.js
- TypeScript
- pnpm
- OpenAI API
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
  _pages/home/ui/home-page.tsx

widgets/
  saju-question-planner/ui/saju-question-planner.tsx

features/
  saju-question-form/
    config/
      goal-options.ts
      mode-options.ts
      step-labels.ts
    model/
      saju-question-form.store.ts
      use-saju-question-planner.ts
    ui/
      goal-fields.tsx
      mode-step.tsx
      question-planner-actions.tsx
      question-planner-step-header.tsx
      result-step.tsx
      saju-step.tsx

entities/
  saju-profile/
    config/birth-profile-options.ts
    model/default-profile.ts
    ui/profile-fields.tsx

shared/
  config/form-steps.ts
  types/saju-question-form.ts
  lib/saju-question-form/
    birth-date-time.ts
    validation.ts
  lib/openai/get-openai-client.ts
```

## 품질 점검

```bash
pnpm lint
```
