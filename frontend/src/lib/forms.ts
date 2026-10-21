export type FormValues = Record<string, string | boolean>;

export function textValue(values: FormValues, name: string) {
  const value = values[name];
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function numberValue(values: FormValues, name: string) {
  const value = textValue(values, name);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}

export function flagValue(values: FormValues, name: string) {
  return values[name] === true;
}

export function displayValue(value: string | number | boolean | null | undefined) {
  if (value === null || value === undefined) return "";
  return String(value);
}

export function validateEmail(value: string | null, required = false) {
  if (!value) return required ? "Email is required." : null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
  return null;
}

export function validateUrl(value: string | null, label: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return `${label} must start with http:// or https://.`;
    }
  } catch {
    return `${label} must be a valid URL.`;
  }
  return null;
}

export function validatePhone(value: string | null) {
  if (!value) return null;
  if (!/^[0-9+().\-\s]{6,24}$/.test(value)) return "Enter a valid phone number.";
  return null;
}

export function validatePeriod(values: FormValues) {
  for (const name of ["startMonth", "endMonth"] as const) {
    const value = numberValue(values, name);
    if (value !== null && (value < 1 || value > 12)) return "Choose a month from January through December.";
  }
  for (const name of ["startYear", "endYear"] as const) {
    const value = numberValue(values, name);
    if (value !== null && (value < 1900 || value > 2100)) return "Year must be between 1900 and 2100.";
  }
  const startYear = numberValue(values, "startYear");
  const endYear = numberValue(values, "endYear");
  const current = flagValue(values, "currentlyWorking");
  if (!current && startYear && endYear && endYear < startYear) {
    return "The end year cannot be earlier than the start year.";
  }
  return null;
}

export const MONTH_OPTIONS = [
  { value: "", label: "Month" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];
