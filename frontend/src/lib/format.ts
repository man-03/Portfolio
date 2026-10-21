const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function monthName(month: number | null | undefined) {
  if (!month || month < 1 || month > 12) return "";
  return MONTHS[month - 1];
}

export function formatMonthYear(month: number | null | undefined, year: number | null | undefined) {
  const name = monthName(month);
  if (name && year) return `${name} ${year}`;
  if (year) return String(year);
  return name;
}

export function formatPeriod(
  startMonth: number | null | undefined,
  startYear: number | null | undefined,
  endMonth: number | null | undefined,
  endYear: number | null | undefined,
  current = false,
) {
  const start = formatMonthYear(startMonth, startYear);
  const end = current ? "Present" : formatMonthYear(endMonth, endYear);
  if (start && end) return `${start} – ${end}`;
  return start || end;
}

export function formatPlace(parts: Array<string | null | undefined>) {
  return parts.map((part) => part?.trim()).filter(Boolean).join(", ");
}

export function splitList(value: string | null | undefined) {
  if (!value) return [];
  return value
    .split(/[,•|/]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function initials(first: string | null | undefined, last: string | null | undefined) {
  const value = `${first?.trim().charAt(0) ?? ""}${last?.trim().charAt(0) ?? ""}`.toUpperCase();
  return value || "MD";
}

export function fullName(first: string | null | undefined, last: string | null | undefined) {
  return [first?.trim(), last?.trim()].filter(Boolean).join(" ");
}

export function safeHttpUrl(value: string | null | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol === "http:" || url.protocol === "https:") return url.toString();
  } catch {
    return null;
  }
  return null;
}

export function isImageUrl(value: string) {
  return /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i.test(value);
}

export function formatBytes(size: number | null | undefined) {
  if (size === null || size === undefined || Number.isNaN(size)) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatTimestamp(value: string | number[] | null | undefined) {
  if (!value) return "";
  const date = Array.isArray(value)
    ? new Date(value[0] ?? 0, (value[1] ?? 1) - 1, value[2] ?? 1, value[3] ?? 0, value[4] ?? 0, value[5] ?? 0)
    : new Date(value);
  if (Number.isNaN(date.getTime())) return typeof value === "string" ? value : "";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatCount(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
