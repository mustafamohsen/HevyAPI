export const encodePathSegment = (value: string | number): string =>
  encodeURIComponent(String(value));
