export const GUIDE_INDEX_PATH = "/guide";
export const GUIDE_INDEX_TITLE = "AI 사주 질문 가이드";
export const GUIDE_INDEX_DESCRIPTION =
  "ChatGPT, Gemini, Claude에 사주를 더 정확하게 물어보기 위한 질문 구조와 예시 프롬프트를 모았습니다.";
export const GUIDE_INDEX_MODIFIED_AT = "2026-04-28T00:00:00+09:00";

export const CHATGPT_SAJU_PROMPT_GUIDE = {
  path: "/guide/chatgpt-saju-prompt",
  title: "ChatGPT 사주 질문 프롬프트 작성법",
  shortTitle: "ChatGPT 사주 질문",
  description:
    "ChatGPT 사주 질문을 더 정확하게 만들기 위한 정보, 질문 구조, 예시 프롬프트를 정리했습니다.",
  excerpt:
    "생년월일, 출생 시간, 고민 맥락을 한 번에 정리해 AI가 답하기 쉬운 사주 질문을 만드는 기본 가이드입니다.",
  primaryKeyword: "ChatGPT 사주 질문",
  intent: "처음 AI 사주 질문을 만드는 사용자를 위한 기본 구조",
  publishedAt: "2026-04-27T00:00:00+09:00",
  modifiedAt: "2026-04-28T00:00:00+09:00",
  displayDate: "2026년 4월 28일",
  tags: ["기본 구조", "ChatGPT", "프롬프트"],
} as const;

export const LOVE_SAJU_PROMPT_GUIDE = {
  path: "/guide/love-saju-prompt",
  title: "연애운 사주 질문 프롬프트 예시",
  shortTitle: "연애운 질문 예시",
  description:
    "ChatGPT에 연애운과 관계 고민을 물어볼 때 필요한 정보, 질문 구조, 예시 프롬프트를 정리했습니다.",
  excerpt:
    "썸, 재회, 장기 연애, 결혼 고민처럼 관계 상황을 구체적으로 적어 연애운 답변을 더 실용적으로 받는 방법입니다.",
  primaryKeyword: "연애운 사주 질문",
  intent: "연애와 관계 고민을 AI에게 구체적으로 묻고 싶은 사용자",
  publishedAt: "2026-04-28T00:00:00+09:00",
  modifiedAt: "2026-04-28T00:00:00+09:00",
  displayDate: "2026년 4월 28일",
  tags: ["연애운", "관계 고민", "질문 예시"],
} as const;

export const CAREER_SAJU_PROMPT_GUIDE = {
  path: "/guide/career-saju-prompt",
  title: "직업운 사주 질문 프롬프트 예시",
  shortTitle: "직업운 질문 예시",
  description:
    "이직, 커리어 전환, 사업 고민을 ChatGPT에 물어볼 때 필요한 사주 질문 프롬프트 예시를 정리했습니다.",
  excerpt:
    "이직 시기, 직무 선택, 사업 준비처럼 현실 조건과 사주 흐름을 함께 검토할 수 있는 직업운 질문 구조입니다.",
  primaryKeyword: "직업운 사주 질문",
  intent: "일과 커리어 고민을 AI 사주 질문으로 정리하려는 사용자",
  publishedAt: "2026-04-28T00:00:00+09:00",
  modifiedAt: "2026-04-28T00:00:00+09:00",
  displayDate: "2026년 4월 28일",
  tags: ["직업운", "이직", "커리어"],
} as const;

export const GUIDE_PAGES = [
  CHATGPT_SAJU_PROMPT_GUIDE,
  LOVE_SAJU_PROMPT_GUIDE,
  CAREER_SAJU_PROMPT_GUIDE,
] as const;

export type GuidePage = (typeof GUIDE_PAGES)[number];
