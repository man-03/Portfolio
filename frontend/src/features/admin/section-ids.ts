export const SECTION_IDS = [
  "profile",
  "skills",
  "experience",
  "projects",
  "education",
  "credentials",
  "links",
  "activities",
  "contact",
  "resume",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const SECTION_LABELS: Record<SectionId, string> = {
  profile: "Profile",
  skills: "Skills",
  experience: "Experience",
  projects: "Projects",
  education: "Education",
  credentials: "Licenses and certifications",
  links: "Links",
  activities: "Activities",
  contact: "Contact",
  resume: "Resume",
};

export function isSectionId(value: string): value is SectionId {
  return (SECTION_IDS as readonly string[]).includes(value);
}
