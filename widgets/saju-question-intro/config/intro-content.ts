export interface IntroBadge {
  title: string;
  description: string;
}

export interface IntroFlowStep {
  step: string;
  title: string;
  description: string;
}

export const HERO_BADGES: IntroBadge[] = [
  {
    title: "약 30초",
    description: "모드 선택부터 질문문 확인까지 빠르게 이어집니다.",
  },
  {
    title: "3단계",
    description: "분석 모드 선택, 사주 정보 입력, 질문문 생성으로 끝납니다.",
  },
  {
    title: "바로 복사",
    description: "완성된 질문문을 원하는 AI에 바로 붙여 넣을 수 있습니다.",
  },
];

export const FLOW_STEPS: IntroFlowStep[] = [
  {
    step: "STEP 1",
    title: "분석 모드 선택",
    description: "내 사주인지, 궁합 분석인지 먼저 정합니다.",
  },
  {
    step: "STEP 2",
    title: "사주 정보 입력",
    description: "생년월일과 고민 맥락을 짧게 정리합니다.",
  },
  {
    step: "STEP 3",
    title: "질문문 완성",
    description: "결과를 확인한 뒤 복사해서 바로 활용합니다.",
  },
];
