export type BirthDateParts = {
  year: string;
  month: string;
  day: string;
};

export type BirthTimeParts = {
  hour: string;
  minute: string;
};

export function parseBirthDateParts(date: string): BirthDateParts {
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return { year: "", month: "", day: "" };
  }

  return { year: match[1], month: match[2], day: match[3] };
}

export function parseBirthTimeParts(time: string): BirthTimeParts {
  const match = time.match(/^(\d{2}):(\d{2})$/);

  if (!match) {
    return { hour: "", minute: "" };
  }

  return { hour: match[1], minute: match[2] };
}

export function getMaxDay(year: string, month: string): number {
  if (!year || !month) {
    return 31;
  }

  return new Date(Number(year), Number(month), 0).getDate();
}
