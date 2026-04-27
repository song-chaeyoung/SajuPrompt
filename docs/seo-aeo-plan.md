# SEO/AEO 개선 계획

확인일: 2026-04-24

## 현재 근거

- `package.json`: Next.js 16.2.4, React 19.2.4 기반 App Router 프로젝트입니다.
- `app/layout.tsx`: 전역 `metadata`, Open Graph, Twitter card, `html lang="ko"`가 이미 설정되어 있습니다.
- `app/page.tsx`, `app/mode/page.tsx`, `app/saju/page.tsx`, `app/result/page.tsx`: 현재 공개 라우트는 홈과 단계형 입력/결과 화면 중심입니다.
- `shared/config/form-steps.ts`: `/mode`, `/saju`, `/result`는 분석 모드 선택, 사주 정보 입력, 결과 확인으로 이어지는 폼 단계입니다.
- `widgets/saju-question-intro/config/intro-content.ts`: 홈의 공개 텍스트는 사용 흐름 설명에 집중되어 있으며, 검색 의도형 가이드 본문은 아직 부족합니다.
- 1차 구현 전에는 `app/robots.ts`, `app/sitemap.ts`가 없었습니다.

## 공식 문서 근거

- Google SEO Starter Guide  
  https://developers.google.com/search/docs/fundamentals/seo-starter-guide  
  검색엔진이 콘텐츠를 이해하고 사용자가 방문 여부를 판단할 수 있도록, 유용하고 고유한 텍스트, 명확한 링크 텍스트, 이미지 맥락, 페이지 구조를 개선하는 것이 기본입니다.

- Google AI Features and Your Website  
  https://developers.google.com/search/docs/appearance/ai-features  
  AI Overviews/AI Mode를 위한 별도 AI 전용 최적화보다 기존 SEO 기본기가 중요합니다. 색인 가능성, 내부 링크, 텍스트 콘텐츠, 페이지 경험, 보이는 내용과 일치하는 구조화 데이터가 핵심입니다.

- Google Structured Data Intro  
  https://developers.google.com/search/docs/guides/intro-structured-data  
  구조화 데이터는 페이지 의미를 명확히 전달하기 위한 표준 형식입니다. Google은 유지보수와 구현 안정성 측면에서 JSON-LD를 권장합니다.

- Google Breadcrumb Structured Data  
  https://developers.google.com/search/docs/appearance/structured-data/breadcrumb  
  가이드/예시 페이지가 추가되면 `BreadcrumbList`는 검색 결과에서 페이지 맥락을 설명하는 데 적합합니다.

- Google FAQPage Structured Data  
  https://developers.google.com/search/docs/appearance/structured-data/faqpage  
  FAQ rich result는 주로 권위 있는 정부/건강 사이트로 제한됩니다. 이 프로젝트에서는 FAQ 마크업을 노출 전략으로 기대하기보다, 사용자가 읽을 수 있는 Q&A 본문으로 활용하는 편이 안전합니다.

- Next.js Metadata and OG Images  
  `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md`  
  Next.js 16 App Router에서는 `metadata` 또는 `generateMetadata`를 Server Component 라우트/레이아웃에서 export해 SEO와 공유 메타데이터를 생성합니다.

- Next.js robots file convention  
  `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/robots.md`  
  `app/robots.ts`로 크롤러 접근 정책과 sitemap URL을 생성할 수 있습니다.

- Next.js sitemap file convention  
  `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md`  
  `app/sitemap.ts`로 색인 대상 URL 목록을 코드로 생성할 수 있습니다.

## 추천 실행 순서

1. 기술 기반 정리
   - `app/sitemap.ts` 추가
   - `app/robots.ts` 추가
   - 홈 canonical URL 명시
   - `/mode`, `/saju`, `/result`의 색인 여부 결정

   근거: 현재 단계형 입력 화면은 검색 유입 목적보다 전환 목적이 강합니다. 검색 색인 대상은 홈과 가이드성 콘텐츠에 집중하는 편이 중복/저품질 색인 위험을 줄입니다.

2. 라우트별 메타데이터 분리
   - 홈: "사주질문지" 브랜드/도구 설명
   - `/mode`: 전역 메타데이터를 상속하고 `noindex`만 적용
   - `/saju`: 전역 메타데이터를 상속하고 `noindex`만 적용
   - `/result`: 전역 메타데이터를 상속하고 `noindex`만 적용

   근거: 단계형 입력 화면은 검색 유입 랜딩이 아니므로 검색 노출용 title/description을 별도로 최적화하지 않습니다. 단, Google이 `noindex`를 확인하려면 페이지가 크롤링 가능해야 하므로 robots 메타는 유지합니다.

3. AEO용 공개 콘텐츠 추가
   - `/guide/saju-question`: AI에게 사주를 잘 물어보는 방법
   - `/guide/chatgpt-saju-prompt`: ChatGPT 사주 질문 프롬프트 예시
   - `/guide/gunghap-question`: 궁합 질문을 정리하는 방법
   - `/examples`: 상황별 질문문 예시

   근거: 현재 홈 콘텐츠는 도구 사용 흐름 중심입니다. "ChatGPT 사주 질문", "사주 프롬프트", "궁합 질문" 같은 검색 의도에 직접 답하는 공개 텍스트가 필요합니다.

4. 구조화 데이터 적용
   - 홈: `WebApplication` 또는 `SoftwareApplication` 검토
   - 가이드 페이지: `BreadcrumbList` 우선 적용
   - FAQ는 마크업보다 본문 Q&A로 우선 제공

   근거: Google은 구조화 데이터가 보이는 본문과 일치해야 한다고 안내합니다. 실제 리뷰/평점이 없다면 리뷰성 구조화 데이터는 추가하지 않습니다.

5. 측정 환경 준비
   - Google Search Console 등록
   - sitemap 제출
   - 핵심 검색어별 노출/클릭/색인 상태 추적
   - 배포 후 Rich Results Test와 URL Inspection으로 검증

   근거: Google 문서 기준으로 구조화 데이터와 색인 상태는 배포 후 Search Console, Rich Results Test, URL Inspection으로 확인해야 합니다.

## 1차 구현 확정값

- 기준 URL은 `SITE_URL` 환경 변수를 우선 사용합니다.
- `SITE_URL`이 없으면 `VERCEL_PROJECT_PRODUCTION_URL`, 마지막으로 `http://localhost:3000`을 사용합니다.
- 1차 sitemap에는 홈(`/`), 첫 공개 가이드(`/guide/chatgpt-saju-prompt`), 개인정보 처리 안내(`/privacy`)를 포함합니다.
- `/mode`, `/saju`, `/result`는 전역 title/description을 상속하고 `noindex, follow`만 별도로 처리합니다.
- `robots.txt`에서는 모든 경로 크롤링을 허용하고 sitemap URL만 명시합니다.
- 첫 공개 가이드 페이지는 "ChatGPT 사주 질문 프롬프트 작성법"으로 시작합니다.
- 개인정보 처리 안내 페이지는 입력값 사용 범위, OpenAI API 전달, DB 저장 없음, 브라우저 상태 보관 방식을 설명합니다.
- 구조화 데이터는 1차 범위에서 제외합니다.

## 키워드 반영 원칙

- 홈의 중심 키워드는 `AI 사주 질문 도우미`와 `사주 질문 프롬프트`로 둡니다.
- 첫 가이드의 중심 키워드는 `ChatGPT 사주 질문`과 `ChatGPT 사주 프롬프트`로 둡니다.
- `사주 풀이 도우미`는 실제 풀이 서비스로 오해될 수 있으므로 보조 키워드로만 사용합니다.
- 보이는 본문, title, description, 내부 링크 앵커에 자연스럽게 반영하고 반복 나열은 피합니다.

## 콘텐츠 작성 원칙

- 각 가이드 상단에는 질문에 대한 직접 답변을 2~3문장으로 둡니다.
- 본문은 체크리스트, 예시, 주의사항, 관련 도구 링크 순서로 구성합니다.
- "사주풀이를 대신 제공한다"보다 "AI에게 더 명확히 물어볼 질문문을 만든다"는 서비스 포지션을 유지합니다.
- 개인 생년월일, 출생시간, 고민 맥락을 다루므로 개인정보 저장 여부와 사용 범위를 명확히 씁니다.
- 구조화 데이터에는 화면에 보이는 내용만 넣습니다.
