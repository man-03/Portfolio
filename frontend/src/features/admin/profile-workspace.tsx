"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button, CheckboxField, MonthField, TextArea, TextField } from "@/components/ui/controls";
import { EmptyState, FormBanner, LoadingBlock } from "@/components/ui/feedback";
import { SECTION_LABELS, visibleSectionIds, type SectionId } from "@/features/admin/section-layout";
import { useSectionLayout } from "@/features/admin/section-layout";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/hooks/use-session";
import { errorMessage, isNotFoundError } from "@/lib/errors";
import { validateEmail, validatePhone, validateUrl } from "@/lib/forms";
import { formatBytes, formatPeriod, formatPlace, formatTimestamp, fullName, safeHttpUrl } from "@/lib/format";
import { adminApi } from "@/services/admin-api";
import type {
  Activity,
  AdminProfile,
  Contact,
  Credential,
  Education,
  Experience,
  LinkItem,
  Project,
  ResumeMeta,
  SkillCategory,
  SkillsAggregate,
} from "@/types/portfolio";

function text(value: string | number | null | undefined) {
  return value === null || value === undefined ? "" : String(value);
}

function nullable(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function optionalNumber(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : Number.NaN;
}

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M10.2 2.4 13.6 5.8 5.8 13.6 2 14l.4-3.8 7.8-7.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EditorActions({
  pending,
  onDiscard,
  onConfirm,
}: {
  pending: boolean;
  onDiscard: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="row">
      <Button variant="secondary" onClick={onDiscard} disabled={pending}>
        Discard
      </Button>
      <Button onClick={onConfirm} disabled={pending}>
        {pending ? "Saving..." : "Confirm"}
      </Button>
    </div>
  );
}

function Copy({ value }: { value: string | null | undefined }) {
  if (!value?.trim()) return null;
  return <p className="rich-copy">{value}</p>;
}

function SectionFrame({
  id,
  editing,
  editable = true,
  onEdit,
  children,
}: {
  id: SectionId;
  editing: boolean;
  editable?: boolean;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <section className="profile-block clay" aria-label={SECTION_LABELS[id]}>
      <div className="section-toolbar">
        <h2>{SECTION_LABELS[id]}</h2>
        {editing || !editable ? null : (
          <button type="button" className="icon-button" aria-label={`Edit ${SECTION_LABELS[id]}`} onClick={onEdit}>
            <PencilIcon />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

type ProfileDraft = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  pronoun: string;
  currentPosition: string;
  myQuote: string;
  headLine: string;
  about: string;
  profileImageUrl: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zip: string;
};

function profileDraft(profile: AdminProfile | null): ProfileDraft {
  const address = profile?.adminAddressResponseDTO;
  return {
    firstName: text(profile?.firstName),
    lastName: text(profile?.lastName),
    dateOfBirth: text(profile?.dateOfBirth),
    pronoun: text(profile?.pronoun),
    currentPosition: text(profile?.currentPosition),
    myQuote: text(profile?.myQuote),
    headLine: text(profile?.headLine),
    about: text(profile?.about),
    profileImageUrl: text(profile?.profileImageUrl),
    address: text(address?.address),
    country: text(address?.country),
    state: text(address?.state),
    city: text(address?.city),
    zip: text(address?.zip),
  };
}

function ProfileEditor({
  userName,
  profile,
  onClose,
  onSaved,
}: {
  userName: string;
  profile: AdminProfile | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [draft, setDraft] = useState(() => profileDraft(profile));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function set(key: keyof ProfileDraft, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function confirm() {
    const imageError = validateUrl(nullable(draft.profileImageUrl), "Profile image");
    if (imageError) return setError(imageError);
    if (draft.dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(draft.dateOfBirth)) {
      return setError("Date of birth must use YYYY-MM-DD.");
    }
    setPending(true);
    setError(null);
    const body = {
      firstName: nullable(draft.firstName),
      lastName: nullable(draft.lastName),
      dateOfBirth: nullable(draft.dateOfBirth),
      pronoun: nullable(draft.pronoun),
      currentPosition: nullable(draft.currentPosition),
      myQuote: nullable(draft.myQuote),
      headLine: nullable(draft.headLine),
      about: nullable(draft.about),
      profileImageUrl: nullable(draft.profileImageUrl),
      adminAddressRequestDTO: {
        address: nullable(draft.address),
        country: nullable(draft.country),
        state: nullable(draft.state),
        city: nullable(draft.city),
        zip: nullable(draft.zip),
      },
    };
    try {
      if (profile) await adminApi.updateProfile(userName, body);
      else await adminApi.createProfile(userName, body);
      toast.success("Profile saved.");
      onSaved();
    } catch (caught) {
      setError(errorMessage(caught, "The profile could not be saved."));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="stack">
      <FormBanner message={error} />
      <div className="form-grid">
        <TextField id="first-name" label="First name" value={draft.firstName} onChange={(value) => set("firstName", value)} />
        <TextField id="last-name" label="Last name" value={draft.lastName} onChange={(value) => set("lastName", value)} />
        <TextField id="headline" label="Headline" value={draft.headLine} onChange={(value) => set("headLine", value)} span="full" />
        <TextField id="position" label="Current position" value={draft.currentPosition} onChange={(value) => set("currentPosition", value)} />
        <TextField id="pronoun" label="Pronoun" value={draft.pronoun} onChange={(value) => set("pronoun", value)} />
        <TextField id="dob" label="Date of birth" type="date" value={draft.dateOfBirth} onChange={(value) => set("dateOfBirth", value)} />
        <TextField id="quote" label="Quote" value={draft.myQuote} onChange={(value) => set("myQuote", value)} />
        <TextField id="photo" label="Profile image URL" type="url" value={draft.profileImageUrl} onChange={(value) => set("profileImageUrl", value)} span="full" />
        <TextArea id="about" label="About" value={draft.about} onChange={(value) => set("about", value)} />
        <TextField id="street" label="Street address" value={draft.address} onChange={(value) => set("address", value)} span="full" />
        <TextField id="city" label="City" value={draft.city} onChange={(value) => set("city", value)} />
        <TextField id="state" label="State" value={draft.state} onChange={(value) => set("state", value)} />
        <TextField id="country" label="Country" value={draft.country} onChange={(value) => set("country", value)} />
        <TextField id="zip" label="Postal code" value={draft.zip} onChange={(value) => set("zip", value)} />
      </div>
      <EditorActions pending={pending} onDiscard={onClose} onConfirm={() => void confirm()} />
    </div>
  );
}

type SkillDraft = { key: string; id?: number; category: string; skills: { key: string; id?: number; skill: string }[] };

function skillsDraft(skills: SkillsAggregate | null): SkillDraft[] {
  return (skills?.categories ?? []).map((category, index) => ({
    key: `category-${category.id ?? index}`,
    id: category.id,
    category: text(category.category),
    skills: (category.skills ?? []).map((skill, skillIndex) => ({
      key: `skill-${skill.id ?? skillIndex}`,
      id: skill.id,
      skill: text(skill.skill),
    })),
  }));
}

function SkillsEditor({
  userName,
  skills,
  onClose,
  onSaved,
}: {
  userName: string;
  skills: SkillsAggregate | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [draft, setDraft] = useState(() => skillsDraft(skills));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const existed = (skills?.categories ?? []).length > 0;

  async function confirm() {
    const categories = draft
      .map((category) => ({
        id: category.id,
        category: nullable(category.category),
        skills: category.skills
          .map((skill) => ({ id: skill.id, skill: nullable(skill.skill) }))
          .filter((skill) => skill.skill),
      }))
      .filter((category) => category.category || (category.skills?.length ?? 0) > 0);
    if (categories.some((category) => !category.category)) {
      return setError("Each skill group needs a category name.");
    }
    setPending(true);
    setError(null);
    try {
      if (existed) await adminApi.updateSkills(userName, { categories });
      else await adminApi.createSkills(userName, { categories });
      toast.success("Skills saved.");
      onSaved();
    } catch (caught) {
      setError(errorMessage(caught, "Skills could not be saved. Reload this section before trying again."));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="stack">
      <FormBanner message={error} />
      {draft.map((category) => (
        <div key={category.key} className="detail-card stack">
          <TextField
            id={`category-${category.key}`}
            label="Category"
            value={category.category}
            onChange={(value) =>
              setDraft((current) => current.map((item) => (item.key === category.key ? { ...item, category: value } : item)))
            }
          />
          {category.skills.map((skill) => (
            <div key={skill.key} className="row">
              <TextField
                id={`skill-${skill.key}`}
                label="Skill"
                value={skill.skill}
                onChange={(value) =>
                  setDraft((current) =>
                    current.map((item) =>
                      item.key === category.key
                        ? { ...item, skills: item.skills.map((entry) => (entry.key === skill.key ? { ...entry, skill: value } : entry)) }
                        : item,
                    ),
                  )
                }
              />
              <Button
                variant="ghost"
                onClick={() =>
                  setDraft((current) =>
                    current.map((item) =>
                      item.key === category.key ? { ...item, skills: item.skills.filter((entry) => entry.key !== skill.key) } : item,
                    ),
                  )
                }
              >
                Remove skill
              </Button>
            </div>
          ))}
          <div className="row">
            <Button
              variant="secondary"
              onClick={() =>
                setDraft((current) =>
                  current.map((item) =>
                    item.key === category.key
                      ? { ...item, skills: [...item.skills, { key: `new-skill-${Date.now()}`, skill: "" }] }
                      : item,
                  ),
                )
              }
            >
              Add skill
            </Button>
            <Button variant="ghost" onClick={() => setDraft((current) => current.filter((item) => item.key !== category.key))}>
              Remove category
            </Button>
          </div>
        </div>
      ))}
      <Button variant="secondary" onClick={() => setDraft((current) => [...current, { key: `new-category-${Date.now()}`, category: "", skills: [] }])}>
        Add category
      </Button>
      <EditorActions pending={pending} onDiscard={onClose} onConfirm={() => void confirm()} />
    </div>
  );
}

type ProjectDraft = {
  key: string;
  id?: number;
  title: string;
  projectDescription: string;
  rolesAndResponsibilities: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  techStack: string;
};

function projectDraft(items: Project[]): ProjectDraft[] {
  return items.map((item) => ({
    key: `project-${item.id}`,
    id: item.id,
    title: text(item.title),
    projectDescription: text(item.projectDescription),
    rolesAndResponsibilities: text(item.rolesAndResponsibilities),
    startMonth: text(item.startMonth),
    startYear: text(item.startYear),
    endMonth: text(item.endMonth),
    endYear: text(item.endYear),
    techStack: text(item.techStack),
  }));
}

function PeriodFields({
  id,
  startMonth,
  startYear,
  endMonth,
  endYear,
  onChange,
}: {
  id: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  onChange: (key: "startMonth" | "startYear" | "endMonth" | "endYear", value: string) => void;
}) {
  return (
    <>
      <MonthField id={`${id}-start-month`} label="Start month" value={startMonth} onChange={(value) => onChange("startMonth", value)} />
      <TextField id={`${id}-start-year`} label="Start year" type="number" value={startYear} onChange={(value) => onChange("startYear", value)} />
      <MonthField id={`${id}-end-month`} label="End month" value={endMonth} onChange={(value) => onChange("endMonth", value)} />
      <TextField id={`${id}-end-year`} label="End year" type="number" value={endYear} onChange={(value) => onChange("endYear", value)} />
    </>
  );
}

function periodError(startMonth: string, startYear: string, endMonth: string, endYear: string) {
  const values = [optionalNumber(startMonth), optionalNumber(startYear), optionalNumber(endMonth), optionalNumber(endYear)];
  if (values.some((value) => Number.isNaN(value))) return "Months and years must be whole numbers.";
  const [monthStart, yearStart, monthEnd, yearEnd] = values;
  if ((monthStart !== null && (monthStart < 1 || monthStart > 12)) || (monthEnd !== null && (monthEnd < 1 || monthEnd > 12))) {
    return "Choose a month from January through December.";
  }
  if ((yearStart !== null && (yearStart < 1900 || yearStart > 2100)) || (yearEnd !== null && (yearEnd < 1900 || yearEnd > 2100))) {
    return "Year must be between 1900 and 2100.";
  }
  if (yearStart && yearEnd && yearEnd < yearStart) return "The end year cannot be earlier than the start year.";
  return null;
}

function ProjectsEditor({
  userName,
  projects,
  onClose,
  onSaved,
}: {
  userName: string;
  projects: Project[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [draft, setDraft] = useState(() => projectDraft(projects));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function update(key: string, field: keyof ProjectDraft, value: string) {
    setDraft((current) => current.map((item) => (item.key === key ? { ...item, [field]: value } : item)));
  }

  async function confirm() {
    for (const item of draft) {
      const issue = periodError(item.startMonth, item.startYear, item.endMonth, item.endYear);
      if (issue) return setError(issue);
      if (!nullable(item.title)) return setError("Each project needs a title.");
    }
    setPending(true);
    setError(null);
    try {
      const kept = new Set(draft.flatMap((item) => (item.id ? [item.id] : [])));
      for (const item of projects) {
        if (!kept.has(item.id)) await adminApi.deleteProject(userName, item.id);
      }
      for (const item of draft) {
        const body = {
          title: nullable(item.title),
          projectDescription: nullable(item.projectDescription),
          rolesAndResponsibilities: nullable(item.rolesAndResponsibilities),
          startMonth: optionalNumber(item.startMonth),
          startYear: optionalNumber(item.startYear),
          endMonth: optionalNumber(item.endMonth),
          endYear: optionalNumber(item.endYear),
          techStack: nullable(item.techStack),
        };
        if (item.id) await adminApi.updateProject(userName, item.id, body);
        else await adminApi.createProject(userName, body);
      }
      toast.success("Projects saved.");
      onSaved();
    } catch (caught) {
      setError(errorMessage(caught, "Projects could not be fully saved. Review the section before trying again."));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="stack">
      <FormBanner message={error} />
      {draft.map((item) => (
        <div key={item.key} className="detail-card form-grid">
          <TextField id={`${item.key}-title`} label="Title" value={item.title} onChange={(value) => update(item.key, "title", value)} span="full" />
          <TextArea id={`${item.key}-description`} label="Description" value={item.projectDescription} onChange={(value) => update(item.key, "projectDescription", value)} />
          <TextArea id={`${item.key}-roles`} label="Roles and responsibilities" value={item.rolesAndResponsibilities} onChange={(value) => update(item.key, "rolesAndResponsibilities", value)} />
          <PeriodFields
            id={item.key}
            startMonth={item.startMonth}
            startYear={item.startYear}
            endMonth={item.endMonth}
            endYear={item.endYear}
            onChange={(key, value) => update(item.key, key, value)}
          />
          <TextField id={`${item.key}-stack`} label="Tech stack" value={item.techStack} onChange={(value) => update(item.key, "techStack", value)} span="full" />
          <Button variant="ghost" onClick={() => setDraft((current) => current.filter((entry) => entry.key !== item.key))}>
            Remove project
          </Button>
        </div>
      ))}
      <Button
        variant="secondary"
        onClick={() =>
          setDraft((current) => [
            ...current,
            {
              key: `new-project-${Date.now()}`,
              title: "",
              projectDescription: "",
              rolesAndResponsibilities: "",
              startMonth: "",
              startYear: "",
              endMonth: "",
              endYear: "",
              techStack: "",
            },
          ])
        }
      >
        Add project
      </Button>
      <EditorActions pending={pending} onDiscard={onClose} onConfirm={() => void confirm()} />
    </div>
  );
}

type ExperienceDraft = {
  key: string;
  id?: number;
  title: string;
  employmentType: string;
  company: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  currentlyWorking: boolean;
  location: string;
  locationType: string;
  description: string;
  companyLogoUrl: string;
};

function ExperienceEditor({
  userName,
  items,
  onClose,
  onSaved,
}: {
  userName: string;
  items: Experience[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [draft, setDraft] = useState<ExperienceDraft[]>(() =>
    items.map((item) => ({
      key: `experience-${item.id}`,
      id: item.id,
      title: text(item.title),
      employmentType: text(item.employmentType),
      company: text(item.company),
      startMonth: text(item.startMonth),
      startYear: text(item.startYear),
      endMonth: text(item.endMonth),
      endYear: text(item.endYear),
      currentlyWorking: Boolean(item.currentlyWorking),
      location: text(item.location),
      locationType: text(item.locationType),
      description: text(item.description),
      companyLogoUrl: text(item.companyLogoUrl),
    })),
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function update<K extends keyof ExperienceDraft>(key: string, field: K, value: ExperienceDraft[K]) {
    setDraft((current) => current.map((item) => (item.key === key ? { ...item, [field]: value } : item)));
  }

  async function confirm() {
    for (const item of draft) {
      const issue = periodError(
        item.startMonth,
        item.startYear,
        item.currentlyWorking ? "" : item.endMonth,
        item.currentlyWorking ? "" : item.endYear,
      );
      if (issue) return setError(issue);
      const logoError = validateUrl(nullable(item.companyLogoUrl), "Company logo");
      if (logoError) return setError(logoError);
      if (!nullable(item.title) && !nullable(item.company)) return setError("Each role needs a title or company.");
    }
    setPending(true);
    setError(null);
    try {
      const kept = new Set(draft.flatMap((item) => (item.id ? [item.id] : [])));
      for (const item of items) {
        if (!kept.has(item.id)) await adminApi.deleteExperience(userName, item.id);
      }
      for (const item of draft) {
        const body = {
          title: nullable(item.title),
          employmentType: nullable(item.employmentType),
          company: nullable(item.company),
          startMonth: optionalNumber(item.startMonth),
          startYear: optionalNumber(item.startYear),
          endMonth: item.currentlyWorking ? null : optionalNumber(item.endMonth),
          endYear: item.currentlyWorking ? null : optionalNumber(item.endYear),
          currentlyWorking: item.currentlyWorking,
          location: nullable(item.location),
          locationType: nullable(item.locationType),
          description: nullable(item.description),
          companyLogoUrl: nullable(item.companyLogoUrl),
        };
        if (item.id) await adminApi.updateExperience(userName, item.id, body);
        else await adminApi.createExperience(userName, body);
      }
      toast.success("Experience saved.");
      onSaved();
    } catch (caught) {
      setError(errorMessage(caught, "Experience could not be fully saved. Review the section before trying again."));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="stack">
      <FormBanner message={error} />
      {draft.map((item) => (
        <div key={item.key} className="detail-card form-grid">
          <TextField id={`${item.key}-title`} label="Title" value={item.title} onChange={(value) => update(item.key, "title", value)} />
          <TextField id={`${item.key}-company`} label="Company" value={item.company} onChange={(value) => update(item.key, "company", value)} />
          <TextField id={`${item.key}-type`} label="Employment type" value={item.employmentType} onChange={(value) => update(item.key, "employmentType", value)} />
          <TextField id={`${item.key}-location`} label="Location" value={item.location} onChange={(value) => update(item.key, "location", value)} />
          <TextField id={`${item.key}-location-type`} label="Location type" value={item.locationType} onChange={(value) => update(item.key, "locationType", value)} />
          <TextField id={`${item.key}-logo`} label="Company logo URL" type="url" value={item.companyLogoUrl} onChange={(value) => update(item.key, "companyLogoUrl", value)} />
          <PeriodFields
            id={item.key}
            startMonth={item.startMonth}
            startYear={item.startYear}
            endMonth={item.endMonth}
            endYear={item.endYear}
            onChange={(key, value) => update(item.key, key, value)}
          />
          <CheckboxField id={`${item.key}-current`} label="Currently working here" checked={item.currentlyWorking} onChange={(value) => update(item.key, "currentlyWorking", value)} />
          <TextArea id={`${item.key}-description`} label="Description" value={item.description} onChange={(value) => update(item.key, "description", value)} />
          <Button variant="ghost" onClick={() => setDraft((current) => current.filter((entry) => entry.key !== item.key))}>
            Remove role
          </Button>
        </div>
      ))}
      <Button
        variant="secondary"
        onClick={() =>
          setDraft((current) => [
            ...current,
            {
              key: `new-experience-${Date.now()}`,
              title: "",
              employmentType: "",
              company: "",
              startMonth: "",
              startYear: "",
              endMonth: "",
              endYear: "",
              currentlyWorking: false,
              location: "",
              locationType: "",
              description: "",
              companyLogoUrl: "",
            },
          ])
        }
      >
        Add role
      </Button>
      <EditorActions pending={pending} onDiscard={onClose} onConfirm={() => void confirm()} />
    </div>
  );
}

type EducationDraft = {
  key: string;
  id?: number;
  degree: string;
  school: string;
  university: string;
  fieldOfStudy: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  grade: string;
  description: string;
  skills: string;
  activities: string;
  schoolLogoUrl: string;
};

function EducationEditor({
  userName,
  items,
  onClose,
  onSaved,
}: {
  userName: string;
  items: Education[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [draft, setDraft] = useState<EducationDraft[]>(() =>
    items.map((item) => ({
      key: `education-${item.id}`,
      id: item.id,
      degree: text(item.degree),
      school: text(item.school),
      university: text(item.university),
      fieldOfStudy: text(item.fieldOfStudy),
      startMonth: text(item.startMonth),
      startYear: text(item.startYear),
      endMonth: text(item.endMonth),
      endYear: text(item.endYear),
      grade: text(item.grade),
      description: text(item.description),
      skills: text(item.skills),
      activities: text(item.activities),
      schoolLogoUrl: text(item.schoolLogoUrl),
    })),
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function update(key: string, field: keyof EducationDraft, value: string) {
    setDraft((current) => current.map((item) => (item.key === key ? { ...item, [field]: value } : item)));
  }

  async function confirm() {
    for (const item of draft) {
      const issue = periodError(item.startMonth, item.startYear, item.endMonth, item.endYear);
      if (issue) return setError(issue);
      const logoError = validateUrl(nullable(item.schoolLogoUrl), "School logo");
      if (logoError) return setError(logoError);
    }
    setPending(true);
    setError(null);
    try {
      const kept = new Set(draft.flatMap((item) => (item.id ? [item.id] : [])));
      for (const item of items) {
        if (!kept.has(item.id)) await adminApi.deleteEducation(userName, item.id);
      }
      for (const item of draft) {
        const body = {
          degree: nullable(item.degree),
          school: nullable(item.school),
          university: nullable(item.university),
          fieldOfStudy: nullable(item.fieldOfStudy),
          startMonth: optionalNumber(item.startMonth),
          startYear: optionalNumber(item.startYear),
          endMonth: optionalNumber(item.endMonth),
          endYear: optionalNumber(item.endYear),
          grade: nullable(item.grade),
          description: nullable(item.description),
          skills: nullable(item.skills),
          activities: nullable(item.activities),
          schoolLogoUrl: nullable(item.schoolLogoUrl),
        };
        if (item.id) await adminApi.updateEducation(userName, item.id, body);
        else await adminApi.createEducation(userName, body);
      }
      toast.success("Education saved.");
      onSaved();
    } catch (caught) {
      setError(errorMessage(caught, "Education could not be fully saved. Review the section before trying again."));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="stack">
      <FormBanner message={error} />
      {draft.map((item) => (
        <div key={item.key} className="detail-card form-grid">
          <TextField id={`${item.key}-degree`} label="Degree" value={item.degree} onChange={(value) => update(item.key, "degree", value)} />
          <TextField id={`${item.key}-field`} label="Field of study" value={item.fieldOfStudy} onChange={(value) => update(item.key, "fieldOfStudy", value)} />
          <TextField id={`${item.key}-school`} label="School" value={item.school} onChange={(value) => update(item.key, "school", value)} />
          <TextField id={`${item.key}-university`} label="University" value={item.university} onChange={(value) => update(item.key, "university", value)} />
          <TextField id={`${item.key}-grade`} label="Grade" value={item.grade} onChange={(value) => update(item.key, "grade", value)} />
          <TextField id={`${item.key}-logo`} label="School logo URL" type="url" value={item.schoolLogoUrl} onChange={(value) => update(item.key, "schoolLogoUrl", value)} />
          <PeriodFields
            id={item.key}
            startMonth={item.startMonth}
            startYear={item.startYear}
            endMonth={item.endMonth}
            endYear={item.endYear}
            onChange={(key, value) => update(item.key, key, value)}
          />
          <TextArea id={`${item.key}-description`} label="Description" value={item.description} onChange={(value) => update(item.key, "description", value)} />
          <TextArea id={`${item.key}-skills`} label="Skills" value={item.skills} onChange={(value) => update(item.key, "skills", value)} />
          <TextArea id={`${item.key}-activities`} label="Activities" value={item.activities} onChange={(value) => update(item.key, "activities", value)} />
          <Button variant="ghost" onClick={() => setDraft((current) => current.filter((entry) => entry.key !== item.key))}>
            Remove education
          </Button>
        </div>
      ))}
      <Button
        variant="secondary"
        onClick={() =>
          setDraft((current) => [
            ...current,
            {
              key: `new-education-${Date.now()}`,
              degree: "",
              school: "",
              university: "",
              fieldOfStudy: "",
              startMonth: "",
              startYear: "",
              endMonth: "",
              endYear: "",
              grade: "",
              description: "",
              skills: "",
              activities: "",
              schoolLogoUrl: "",
            },
          ])
        }
      >
        Add education
      </Button>
      <EditorActions pending={pending} onDiscard={onClose} onConfirm={() => void confirm()} />
    </div>
  );
}

type CredentialDraft = {
  key: string;
  id?: number;
  name: string;
  issuingOrganisation: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  credentialId: string;
  credentialUrl: string;
  landcUrl: string;
  orgLogoUrl: string;
};

function CredentialsEditor({
  userName,
  items,
  onClose,
  onSaved,
}: {
  userName: string;
  items: Credential[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [draft, setDraft] = useState<CredentialDraft[]>(() =>
    items.map((item) => ({
      key: `credential-${item.id}`,
      id: item.id,
      name: text(item.name),
      issuingOrganisation: text(item.issuingOrganisation),
      startMonth: text(item.startMonth),
      startYear: text(item.startYear),
      endMonth: text(item.endMonth),
      endYear: text(item.endYear),
      credentialId: text(item.credentialId),
      credentialUrl: text(item.credentialUrl),
      landcUrl: text(item.landcUrl),
      orgLogoUrl: text(item.orgLogoUrl),
    })),
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function update(key: string, field: keyof CredentialDraft, value: string) {
    setDraft((current) => current.map((item) => (item.key === key ? { ...item, [field]: value } : item)));
  }

  async function confirm() {
    for (const item of draft) {
      const issue = periodError(item.startMonth, item.startYear, item.endMonth, item.endYear);
      if (issue) return setError(issue);
      for (const [value, label] of [
        [item.credentialUrl, "Credential URL"],
        [item.landcUrl, "License URL"],
        [item.orgLogoUrl, "Organisation logo"],
      ] as const) {
        const urlError = validateUrl(nullable(value), label);
        if (urlError) return setError(urlError);
      }
    }
    setPending(true);
    setError(null);
    try {
      const kept = new Set(draft.flatMap((item) => (item.id ? [item.id] : [])));
      for (const item of items) {
        if (!kept.has(item.id)) await adminApi.deleteCredential(userName, item.id);
      }
      for (const item of draft) {
        const body = {
          name: nullable(item.name),
          issuingOrganisation: nullable(item.issuingOrganisation),
          startMonth: optionalNumber(item.startMonth),
          startYear: optionalNumber(item.startYear),
          endMonth: optionalNumber(item.endMonth),
          endYear: optionalNumber(item.endYear),
          credentialId: nullable(item.credentialId),
          credentialUrl: nullable(item.credentialUrl),
          landcUrl: nullable(item.landcUrl),
          orgLogoUrl: nullable(item.orgLogoUrl),
        };
        if (item.id) await adminApi.updateCredential(userName, item.id, body);
        else await adminApi.createCredential(userName, body);
      }
      toast.success("Licenses and certifications saved.");
      onSaved();
    } catch (caught) {
      setError(errorMessage(caught, "Licenses could not be fully saved. Review the section before trying again."));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="stack">
      <FormBanner message={error} />
      {draft.map((item) => (
        <div key={item.key} className="detail-card form-grid">
          <TextField id={`${item.key}-name`} label="Name" value={item.name} onChange={(value) => update(item.key, "name", value)} />
          <TextField id={`${item.key}-org`} label="Issuing organisation" value={item.issuingOrganisation} onChange={(value) => update(item.key, "issuingOrganisation", value)} />
          <TextField id={`${item.key}-id`} label="Credential ID" value={item.credentialId} onChange={(value) => update(item.key, "credentialId", value)} />
          <TextField id={`${item.key}-url`} label="Credential URL" type="url" value={item.credentialUrl} onChange={(value) => update(item.key, "credentialUrl", value)} />
          <TextField id={`${item.key}-license`} label="License URL" type="url" value={item.landcUrl} onChange={(value) => update(item.key, "landcUrl", value)} />
          <TextField id={`${item.key}-logo`} label="Organisation logo URL" type="url" value={item.orgLogoUrl} onChange={(value) => update(item.key, "orgLogoUrl", value)} />
          <PeriodFields
            id={item.key}
            startMonth={item.startMonth}
            startYear={item.startYear}
            endMonth={item.endMonth}
            endYear={item.endYear}
            onChange={(key, value) => update(item.key, key, value)}
          />
          <Button variant="ghost" onClick={() => setDraft((current) => current.filter((entry) => entry.key !== item.key))}>
            Remove credential
          </Button>
        </div>
      ))}
      <Button
        variant="secondary"
        onClick={() =>
          setDraft((current) => [
            ...current,
            {
              key: `new-credential-${Date.now()}`,
              name: "",
              issuingOrganisation: "",
              startMonth: "",
              startYear: "",
              endMonth: "",
              endYear: "",
              credentialId: "",
              credentialUrl: "",
              landcUrl: "",
              orgLogoUrl: "",
            },
          ])
        }
      >
        Add credential
      </Button>
      <EditorActions pending={pending} onDiscard={onClose} onConfirm={() => void confirm()} />
    </div>
  );
}

function LinksEditor({
  userName,
  items,
  onClose,
  onSaved,
}: {
  userName: string;
  items: LinkItem[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [draft, setDraft] = useState(() =>
    items.map((item) => ({ key: `link-${item.id}`, id: item.id as number | undefined, platform: text(item.platform), url: text(item.url) })),
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function confirm() {
    for (const item of draft) {
      const urlError = validateUrl(nullable(item.url), "Link");
      if (urlError) return setError(urlError);
      if (nullable(item.url) && !nullable(item.platform)) return setError("Each link needs a platform name.");
    }
    setPending(true);
    setError(null);
    try {
      const kept = new Set(draft.flatMap((item) => (item.id ? [item.id] : [])));
      for (const item of items) {
        if (!kept.has(item.id)) await adminApi.deleteLink(userName, item.id);
      }
      for (const item of draft) {
        const body = { platform: nullable(item.platform), url: nullable(item.url) };
        if (item.id) await adminApi.updateLink(userName, item.id, body);
        else if (body.platform || body.url) await adminApi.createLink(userName, body);
      }
      toast.success("Links saved.");
      onSaved();
    } catch (caught) {
      setError(errorMessage(caught, "Links could not be fully saved. Review the section before trying again."));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="stack">
      <FormBanner message={error} />
      <p className="sidebar-note">Link updates currently depend on the existing API. If a change does not stick, the service may not be persisting the update.</p>
      {draft.map((item) => (
        <div key={item.key} className="detail-card form-grid">
          <TextField
            id={`${item.key}-platform`}
            label="Platform"
            value={item.platform}
            onChange={(value) => setDraft((current) => current.map((entry) => (entry.key === item.key ? { ...entry, platform: value } : entry)))}
          />
          <TextField
            id={`${item.key}-url`}
            label="URL"
            type="url"
            value={item.url}
            onChange={(value) => setDraft((current) => current.map((entry) => (entry.key === item.key ? { ...entry, url: value } : entry)))}
          />
          <Button variant="ghost" onClick={() => setDraft((current) => current.filter((entry) => entry.key !== item.key))}>
            Remove link
          </Button>
        </div>
      ))}
      <Button variant="secondary" onClick={() => setDraft((current) => [...current, { key: `new-link-${Date.now()}`, id: undefined, platform: "", url: "" }])}>
        Add link
      </Button>
      <EditorActions pending={pending} onDiscard={onClose} onConfirm={() => void confirm()} />
    </div>
  );
}

function ActivitiesEditor({
  userName,
  items,
  onClose,
  onSaved,
}: {
  userName: string;
  items: Activity[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [draft, setDraft] = useState(() =>
    items.map((item) => ({
      key: `activity-${item.id}`,
      id: item.id as number | undefined,
      activityDescription: text(item.activityDescription),
      activityMediaUrl: text(item.activityMediaUrl),
    })),
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function confirm() {
    for (const item of draft) {
      const urlError = validateUrl(nullable(item.activityMediaUrl), "Activity media");
      if (urlError) return setError(urlError);
    }
    setPending(true);
    setError(null);
    try {
      const kept = new Set(draft.flatMap((item) => (item.id ? [item.id] : [])));
      for (const item of items) {
        if (!kept.has(item.id)) await adminApi.deleteActivity(userName, item.id);
      }
      for (const item of draft) {
        const body = { activityDescription: nullable(item.activityDescription), activityMediaUrl: nullable(item.activityMediaUrl) };
        if (item.id) await adminApi.updateActivity(userName, item.id, body);
        else if (body.activityDescription || body.activityMediaUrl) await adminApi.createActivity(userName, body);
      }
      toast.success("Activities saved.");
      onSaved();
    } catch (caught) {
      setError(errorMessage(caught, "Activities could not be fully saved. Review the section before trying again."));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="stack">
      <FormBanner message={error} />
      {draft.map((item) => (
        <div key={item.key} className="detail-card stack">
          <TextArea
            id={`${item.key}-description`}
            label="Description"
            value={item.activityDescription}
            onChange={(value) => setDraft((current) => current.map((entry) => (entry.key === item.key ? { ...entry, activityDescription: value } : entry)))}
          />
          <TextField
            id={`${item.key}-media`}
            label="Media URL"
            type="url"
            value={item.activityMediaUrl}
            onChange={(value) => setDraft((current) => current.map((entry) => (entry.key === item.key ? { ...entry, activityMediaUrl: value } : entry)))}
          />
          <Button variant="ghost" onClick={() => setDraft((current) => current.filter((entry) => entry.key !== item.key))}>
            Remove activity
          </Button>
        </div>
      ))}
      <Button
        variant="secondary"
        onClick={() => setDraft((current) => [...current, { key: `new-activity-${Date.now()}`, id: undefined, activityDescription: "", activityMediaUrl: "" }])}
      >
        Add activity
      </Button>
      <EditorActions pending={pending} onDiscard={onClose} onConfirm={() => void confirm()} />
    </div>
  );
}

function ContactEditor({
  userName,
  contact,
  onClose,
  onSaved,
}: {
  userName: string;
  contact: Contact | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [email, setEmail] = useState(text(contact?.email));
  const [phone, setPhone] = useState(text(contact?.phone));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function confirm() {
    const emailError = validateEmail(nullable(email));
    const phoneError = validatePhone(nullable(phone));
    if (emailError || phoneError) return setError(emailError ?? phoneError);
    setPending(true);
    setError(null);
    const body = { email: nullable(email), phone: nullable(phone) };
    try {
      if (contact) await adminApi.updateContact(userName, contact.id, body);
      else await adminApi.createContact(userName, body);
      toast.success("Contact saved.");
      onSaved();
    } catch (caught) {
      setError(errorMessage(caught, "Contact details could not be saved."));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="stack">
      <FormBanner message={error} />
      <div className="form-grid">
        <TextField id="contact-email" label="Email" type="email" value={email} onChange={setEmail} />
        <TextField id="contact-phone" label="Phone" value={phone} onChange={setPhone} />
      </div>
      <EditorActions pending={pending} onDiscard={onClose} onConfirm={() => void confirm()} />
    </div>
  );
}

function ResumeDetails({ resume }: { resume: ResumeMeta | null }) {
  if (!resume) return <EmptyState title="No resume is on file." description="Upload a PDF from the sidebar." />;
  return (
    <div className="stack">
      <p>{resume.fileName || "Resume PDF"}</p>
      <p className="sidebar-note">
        {[formatBytes(resume.fileSize), formatTimestamp(resume.uploadedAt)].filter(Boolean).join(" · ")}
      </p>
      <p className="sidebar-note">Replace the file from the sidebar. The API accepts one PDF.</p>
    </div>
  );
}

type StudioData = {
  profile: AdminProfile | null;
  profileBlocked: string | null;
  skills: SkillsAggregate | null;
  projects: Project[];
  education: Education[];
  experience: Experience[];
  credentials: Credential[];
  links: LinkItem[];
  activities: Activity[];
  contact: Contact | null;
  resume: ResumeMeta | null;
  loadError: string | null;
};

const EMPTY_DATA: StudioData = {
  profile: null,
  profileBlocked: null,
  skills: null,
  projects: [],
  education: [],
  experience: [],
  credentials: [],
  links: [],
  activities: [],
  contact: null,
  resume: null,
  loadError: null,
};

async function settleList<T>(request: Promise<T[]>): Promise<T[]> {
  try {
    const value = await request;
    return Array.isArray(value) ? value : [];
  } catch (caught) {
    if (isNotFoundError(caught)) return [];
    throw caught;
  }
}

export function ProfileWorkspace() {
  const session = useSession();
  const userName = session?.userName ?? "";
  const layout = useSectionLayout();
  const [data, setData] = useState<StudioData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [editing, setEditing] = useState<SectionId | null>(null);

  useEffect(() => {
    if (!userName) return;
    let active = true;
    const load = async () => {
      const next = { ...EMPTY_DATA };
      try {
        const [profileResult, skillsResult, projects, education, experience, credentials, links, activities, contactResult, resumeResult] =
          await Promise.allSettled([
            adminApi.getProfile(userName),
            adminApi.getSkills(userName),
            settleList(adminApi.listProjects(userName)),
            settleList(adminApi.listEducation(userName)),
            settleList(adminApi.listExperience(userName)),
            settleList(adminApi.listCredentials(userName)),
            settleList(adminApi.listLinks(userName)),
            settleList(adminApi.listActivities(userName)),
            adminApi.getContact(userName),
            adminApi.getResume(userName),
          ]);
        if (!active) return;
        if (profileResult.status === "fulfilled") next.profile = profileResult.value;
        else if (isNotFoundError(profileResult.reason) && /admin not found/i.test(profileResult.reason.message)) next.profile = null;
        else next.profileBlocked = errorMessage(profileResult.reason, "The profile could not be loaded.");
        if (skillsResult.status === "fulfilled") next.skills = skillsResult.value;
        else if (!isNotFoundError(skillsResult.reason)) next.loadError = errorMessage(skillsResult.reason, "Skills could not be loaded.");
        if (projects.status === "fulfilled") next.projects = projects.value;
        else next.loadError = errorMessage(projects.reason, "Projects could not be loaded.");
        if (education.status === "fulfilled") next.education = education.value;
        else next.loadError = errorMessage(education.reason, "Education could not be loaded.");
        if (experience.status === "fulfilled") next.experience = experience.value;
        else next.loadError = errorMessage(experience.reason, "Experience could not be loaded.");
        if (credentials.status === "fulfilled") next.credentials = credentials.value;
        else next.loadError = errorMessage(credentials.reason, "Licenses could not be loaded.");
        if (links.status === "fulfilled") next.links = links.value;
        else next.loadError = errorMessage(links.reason, "Links could not be loaded.");
        if (activities.status === "fulfilled") next.activities = activities.value;
        else next.loadError = errorMessage(activities.reason, "Activities could not be loaded.");
        if (contactResult.status === "fulfilled") next.contact = contactResult.value;
        else if (!isNotFoundError(contactResult.reason)) next.loadError = errorMessage(contactResult.reason, "Contact details could not be loaded.");
        if (resumeResult.status === "fulfilled") next.resume = resumeResult.value;
        else if (!isNotFoundError(resumeResult.reason)) next.loadError = errorMessage(resumeResult.reason, "The resume could not be loaded.");
        setData(next);
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [userName, reloadKey]);

  function saved() {
    setEditing(null);
    setLoading(true);
    setReloadKey((value) => value + 1);
  }

  const visible = visibleSectionIds(layout);

  if (!userName || loading) return <LoadingBlock label="Loading profile" />;

  function renderSection(id: SectionId) {
    const editingThis = editing === id;
    const body = (() => {
      if (id === "profile") {
        if (data.profileBlocked) return <FormBanner message={data.profileBlocked} />;
        if (editingThis) return <ProfileEditor userName={userName} profile={data.profile} onClose={() => setEditing(null)} onSaved={saved} />;
        if (!data.profile) return <EmptyState title="No profile is saved yet." />;
        const address = data.profile.adminAddressResponseDTO;
        return (
          <div className="stack">
            <h3>{fullName(data.profile.firstName, data.profile.lastName) || "Unnamed profile"}</h3>
            <Copy value={data.profile.headLine} />
            <Copy value={data.profile.currentPosition} />
            <Copy value={data.profile.pronoun} />
            <Copy value={data.profile.myQuote} />
            <Copy value={data.profile.about} />
            <Copy value={data.profile.dateOfBirth ? `Date of birth ${data.profile.dateOfBirth}` : null} />
            {safeHttpUrl(data.profile.profileImageUrl) ? <p>{data.profile.profileImageUrl}</p> : null}
            <Copy value={formatPlace([address?.address, address?.city, address?.state, address?.zip, address?.country])} />
          </div>
        );
      }
      if (id === "skills") {
        if (editingThis) return <SkillsEditor userName={userName} skills={data.skills} onClose={() => setEditing(null)} onSaved={saved} />;
        const categories = data.skills?.categories ?? [];
        if (!categories.length) return <EmptyState title="No skills are saved yet." />;
        return (
          <div className="stack">
            {categories.map((category: SkillCategory) => (
              <div key={category.id} className="detail-card">
                <h3>{category.category}</h3>
                <p>{(category.skills ?? []).map((skill) => skill.skill).filter(Boolean).join(", ")}</p>
              </div>
            ))}
          </div>
        );
      }
      if (id === "projects") {
        if (editingThis) return <ProjectsEditor userName={userName} projects={data.projects} onClose={() => setEditing(null)} onSaved={saved} />;
        if (!data.projects.length) return <EmptyState title="No projects are saved yet." />;
        return (
          <div className="detail-list">
            {data.projects.map((item) => (
              <article key={item.id} className="detail-card stack">
                <h3>{item.title}</h3>
                <p className="sidebar-note">{formatPeriod(item.startMonth, item.startYear, item.endMonth, item.endYear)}</p>
                <Copy value={item.projectDescription} />
                <Copy value={item.rolesAndResponsibilities} />
                <Copy value={item.techStack} />
              </article>
            ))}
          </div>
        );
      }
      if (id === "experience") {
        if (editingThis) return <ExperienceEditor userName={userName} items={data.experience} onClose={() => setEditing(null)} onSaved={saved} />;
        if (!data.experience.length) return <EmptyState title="No experience is saved yet." />;
        return (
          <div className="detail-list">
            {data.experience.map((item) => (
              <article key={item.id} className="detail-card stack">
                <h3>{[item.title, item.company].filter(Boolean).join(" · ")}</h3>
                <p className="sidebar-note">
                  {[item.employmentType, formatPeriod(item.startMonth, item.startYear, item.endMonth, item.endYear, Boolean(item.currentlyWorking)), item.location, item.locationType]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <Copy value={item.description} />
              </article>
            ))}
          </div>
        );
      }
      if (id === "education") {
        if (editingThis) return <EducationEditor userName={userName} items={data.education} onClose={() => setEditing(null)} onSaved={saved} />;
        if (!data.education.length) return <EmptyState title="No education is saved yet." />;
        return (
          <div className="detail-list">
            {data.education.map((item) => (
              <article key={item.id} className="detail-card stack">
                <h3>{[item.degree, item.fieldOfStudy].filter(Boolean).join(", ") || item.school || "Education"}</h3>
                <p className="sidebar-note">
                  {[item.school, item.university, formatPeriod(item.startMonth, item.startYear, item.endMonth, item.endYear), item.grade].filter(Boolean).join(" · ")}
                </p>
                <Copy value={item.description} />
                <Copy value={item.skills} />
                <Copy value={item.activities} />
              </article>
            ))}
          </div>
        );
      }
      if (id === "credentials") {
        if (editingThis) return <CredentialsEditor userName={userName} items={data.credentials} onClose={() => setEditing(null)} onSaved={saved} />;
        if (!data.credentials.length) return <EmptyState title="No licenses or certifications are saved yet." />;
        return (
          <div className="detail-list">
            {data.credentials.map((item) => (
              <article key={item.id} className="detail-card stack">
                <h3>{item.name}</h3>
                <p className="sidebar-note">
                  {[item.issuingOrganisation, formatPeriod(item.startMonth, item.startYear, item.endMonth, item.endYear), item.credentialId].filter(Boolean).join(" · ")}
                </p>
                {safeHttpUrl(item.credentialUrl) ? <a href={safeHttpUrl(item.credentialUrl) ?? undefined}>Credential</a> : null}
                {safeHttpUrl(item.landcUrl) ? <a href={safeHttpUrl(item.landcUrl) ?? undefined}>License</a> : null}
              </article>
            ))}
          </div>
        );
      }
      if (id === "links") {
        if (editingThis) return <LinksEditor userName={userName} items={data.links} onClose={() => setEditing(null)} onSaved={saved} />;
        if (!data.links.length) return <EmptyState title="No links are saved yet." />;
        return (
          <div className="detail-list">
            {data.links.map((item) => {
              const href = safeHttpUrl(item.url);
              return (
                <article key={item.id} className="detail-card">
                  <h3>{item.platform}</h3>
                  {href ? <a href={href}>{item.url}</a> : <p>{item.url}</p>}
                </article>
              );
            })}
          </div>
        );
      }
      if (id === "activities") {
        if (editingThis) return <ActivitiesEditor userName={userName} items={data.activities} onClose={() => setEditing(null)} onSaved={saved} />;
        if (!data.activities.length) return <EmptyState title="No activities are saved yet." />;
        return (
          <div className="detail-list">
            {data.activities.map((item) => (
              <article key={item.id} className="detail-card stack">
                <Copy value={item.activityDescription} />
                {safeHttpUrl(item.activityMediaUrl) ? <a href={safeHttpUrl(item.activityMediaUrl) ?? undefined}>{item.activityMediaUrl}</a> : null}
              </article>
            ))}
          </div>
        );
      }
      if (id === "contact") {
        if (editingThis) return <ContactEditor userName={userName} contact={data.contact} onClose={() => setEditing(null)} onSaved={saved} />;
        if (!data.contact) return <EmptyState title="No contact details are saved yet." />;
        return (
          <div className="stack">
            <Copy value={data.contact.email} />
            <Copy value={data.contact.phone} />
          </div>
        );
      }
      return <ResumeDetails resume={data.resume} />;
    })();

    return (
      <SectionFrame key={id} id={id} editing={editingThis} editable={id !== "resume"} onEdit={() => setEditing(id)}>
        {body}
      </SectionFrame>
    );
  }

  return (
    <div className="stack">
      <header className="page-intro">
        <h1>My Profile</h1>
        <p>Use the pencil to edit a section, then Discard or Confirm. Reorder sections from the sidebar.</p>
      </header>
      <FormBanner message={data.loadError} />
      {visible.map((id) => renderSection(id))}
    </div>
  );
}
