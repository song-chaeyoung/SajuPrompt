// Representative longitudes use each metropolitan city center or
// provincial administrative seat as the regional reference point.
export const KOREAN_BIRTH_PLACE_OPTIONS = [
  { code: "seoul", label: "서울특별시", longitude: 126.978 },
  { code: "busan", label: "부산광역시", longitude: 129.0756 },
  { code: "daegu", label: "대구광역시", longitude: 128.6014 },
  { code: "incheon", label: "인천광역시", longitude: 126.7052 },
  { code: "gwangju", label: "광주광역시", longitude: 126.8526 },
  { code: "daejeon", label: "대전광역시", longitude: 127.3845 },
  { code: "sejong", label: "세종특별자치시", longitude: 127.289 },
  { code: "ulsan", label: "울산광역시", longitude: 129.3114 },
  { code: "gyeonggi", label: "경기도", longitude: 127.0286 },
  { code: "gangwon", label: "강원특별자치도", longitude: 127.7298 },
  { code: "chungbuk", label: "충청북도", longitude: 127.489 },
  { code: "chungnam", label: "충청남도", longitude: 126.6609 },
  { code: "jeonbuk", label: "전북특별자치도", longitude: 127.148 },
  { code: "jeonnam", label: "전라남도", longitude: 126.4817 },
  { code: "gyeongbuk", label: "경상북도", longitude: 128.7294 },
  { code: "gyeongnam", label: "경상남도", longitude: 128.6811 },
  { code: "jeju", label: "제주특별자치도", longitude: 126.5312 },
] as const;

export type KoreanBirthPlaceCode =
  (typeof KOREAN_BIRTH_PLACE_OPTIONS)[number]["code"];

const KOREAN_BIRTH_PLACE_BY_CODE = new Map(
  KOREAN_BIRTH_PLACE_OPTIONS.map((option) => [option.code, option]),
);

export function isKoreanBirthPlaceCode(
  value: string,
): value is KoreanBirthPlaceCode {
  return KOREAN_BIRTH_PLACE_BY_CODE.has(value as KoreanBirthPlaceCode);
}

export function getKoreanBirthPlaceOption(
  code: KoreanBirthPlaceCode | "",
) {
  if (!code) {
    return null;
  }

  return KOREAN_BIRTH_PLACE_BY_CODE.get(code) ?? null;
}
