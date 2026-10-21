"use client";

import { ResourceManager, type FieldConfig } from "@/components/admin/resource-manager";
import { useSession } from "@/hooks/use-session";
import { displayValue, flagValue, numberValue, textValue, validatePeriod, validateUrl, type FormValues } from "@/lib/forms";
import { formatPeriod } from "@/lib/format";
import { adminApi } from "@/services/admin-api";
import type { Activity, Credential, Education, Experience, LinkItem, Project } from "@/types/portfolio";

const periodFields: FieldConfig[] = [
  { name: "startMonth", label: "Start month", type: "month" },
  { name: "startYear", label: "Start year", type: "year" },
  { name: "endMonth", label: "End month", type: "month" },
  { name: "endYear", label: "End year", type: "year" },
];

function periodValues(item: {
  startMonth: number | null;
  startYear: number | null;
  endMonth: number | null;
  endYear: number | null;
}): FormValues {
  return {
    startMonth: displayValue(item.startMonth),
    startYear: displayValue(item.startYear),
    endMonth: displayValue(item.endMonth),
    endYear: displayValue(item.endYear),
  };
}

function requireText(values: FormValues, name: string, label: string) {
  return textValue(values, name) ? null : `${label} is required.`;
}

export function ProjectsView() {
  const session = useSession();
  if (!session) return null;
  return (
    <ResourceManager
      title="Projects"
      singular="project"
      description="Projects appear on the public portfolio only after they are saved here."
      userName={session.userName}
      load={adminApi.listProjects}
      create={adminApi.createProject}
      update={adminApi.updateProject}
      remove={adminApi.deleteProject}
      fields={[
        { name: "title", label: "Title", type: "text", required: true, span: "full" },
        ...periodFields,
        { name: "techStack", label: "Tech stack", type: "text", span: "full", hint: "Separate tools with commas." },
        { name: "projectDescription", label: "Description", type: "textarea" },
        { name: "rolesAndResponsibilities", label: "Roles and responsibilities", type: "textarea" },
      ]}
      emptyValues={{
        title: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        techStack: "",
        projectDescription: "",
        rolesAndResponsibilities: "",
      }}
      toForm={(item: Project) => ({
        title: displayValue(item.title),
        ...periodValues(item),
        techStack: displayValue(item.techStack),
        projectDescription: displayValue(item.projectDescription),
        rolesAndResponsibilities: displayValue(item.rolesAndResponsibilities),
      })}
      fromForm={(values) => ({
        title: textValue(values, "title"),
        projectDescription: textValue(values, "projectDescription"),
        rolesAndResponsibilities: textValue(values, "rolesAndResponsibilities"),
        startMonth: numberValue(values, "startMonth"),
        startYear: numberValue(values, "startYear"),
        endMonth: numberValue(values, "endMonth"),
        endYear: numberValue(values, "endYear"),
        techStack: textValue(values, "techStack"),
      })}
      validate={(values) => requireText(values, "title", "Title") ?? validatePeriod(values)}
      renderSummary={(item) => (
        <>
          <h3>{item.title}</h3>
          <p className="muted">{formatPeriod(item.startMonth, item.startYear, item.endMonth, item.endYear)}</p>
        </>
      )}
    />
  );
}

export function ExperienceView() {
  const session = useSession();
  if (!session) return null;
  return (
    <ResourceManager
      title="Experience"
      singular="role"
      description="Professional experience is listed in the order returned by the API."
      userName={session.userName}
      load={adminApi.listExperience}
      create={adminApi.createExperience}
      update={adminApi.updateExperience}
      remove={adminApi.deleteExperience}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "company", label: "Company", type: "text", required: true },
        { name: "employmentType", label: "Employment type", type: "text", list: "employment-types" },
        { name: "location", label: "Location", type: "text" },
        { name: "locationType", label: "Location type", type: "text", list: "location-types" },
        ...periodFields,
        { name: "currentlyWorking", label: "I currently work here", type: "checkbox" },
        { name: "companyLogoUrl", label: "Company logo URL", type: "url", span: "full" },
        { name: "description", label: "Description", type: "textarea" },
      ]}
      emptyValues={{
        title: "",
        company: "",
        employmentType: "",
        location: "",
        locationType: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        currentlyWorking: false,
        companyLogoUrl: "",
        description: "",
      }}
      toForm={(item: Experience) => ({
        title: displayValue(item.title),
        company: displayValue(item.company),
        employmentType: displayValue(item.employmentType),
        location: displayValue(item.location),
        locationType: displayValue(item.locationType),
        ...periodValues(item),
        currentlyWorking: Boolean(item.currentlyWorking),
        companyLogoUrl: displayValue(item.companyLogoUrl),
        description: displayValue(item.description),
      })}
      fromForm={(values) => ({
        title: textValue(values, "title"),
        employmentType: textValue(values, "employmentType"),
        company: textValue(values, "company"),
        startMonth: numberValue(values, "startMonth"),
        startYear: numberValue(values, "startYear"),
        endMonth: numberValue(values, "endMonth"),
        endYear: numberValue(values, "endYear"),
        currentlyWorking: flagValue(values, "currentlyWorking"),
        location: textValue(values, "location"),
        locationType: textValue(values, "locationType"),
        description: textValue(values, "description"),
        companyLogoUrl: textValue(values, "companyLogoUrl"),
      })}
      validate={(values) =>
        requireText(values, "title", "Title") ??
        requireText(values, "company", "Company") ??
        validateUrl(textValue(values, "companyLogoUrl"), "Company logo URL") ??
        validatePeriod(values)
      }
      renderSummary={(item) => (
        <>
          <h3>{item.title}</h3>
          <p className="muted">
            {[item.company, formatPeriod(item.startMonth, item.startYear, item.endMonth, item.endYear, Boolean(item.currentlyWorking))]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </>
      )}
      extra={
        <>
          <datalist id="employment-types">
            <option value="Full-time" />
            <option value="Part-time" />
            <option value="Contract" />
            <option value="Internship" />
            <option value="Freelance" />
          </datalist>
          <datalist id="location-types">
            <option value="On-site" />
            <option value="Hybrid" />
            <option value="Remote" />
          </datalist>
        </>
      }
    />
  );
}

export function EducationView() {
  const session = useSession();
  if (!session) return null;
  return (
    <ResourceManager
      title="Education"
      singular="education record"
      description="Degrees, schools, and study details shown on the public portfolio."
      userName={session.userName}
      load={adminApi.listEducation}
      create={adminApi.createEducation}
      update={adminApi.updateEducation}
      remove={adminApi.deleteEducation}
      fields={[
        { name: "degree", label: "Degree", type: "text", required: true },
        { name: "fieldOfStudy", label: "Field of study", type: "text" },
        { name: "school", label: "School", type: "text" },
        { name: "university", label: "University", type: "text" },
        ...periodFields,
        { name: "grade", label: "Grade", type: "text" },
        { name: "schoolLogoUrl", label: "School logo URL", type: "url" },
        { name: "skills", label: "Skills", type: "text", span: "full", hint: "Separate skills with commas." },
        { name: "description", label: "Description", type: "textarea" },
        { name: "activities", label: "Activities", type: "textarea" },
      ]}
      emptyValues={{
        degree: "",
        fieldOfStudy: "",
        school: "",
        university: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        grade: "",
        schoolLogoUrl: "",
        skills: "",
        description: "",
        activities: "",
      }}
      toForm={(item: Education) => ({
        degree: displayValue(item.degree),
        fieldOfStudy: displayValue(item.fieldOfStudy),
        school: displayValue(item.school),
        university: displayValue(item.university),
        ...periodValues(item),
        grade: displayValue(item.grade),
        schoolLogoUrl: displayValue(item.schoolLogoUrl),
        skills: displayValue(item.skills),
        description: displayValue(item.description),
        activities: displayValue(item.activities),
      })}
      fromForm={(values) => ({
        degree: textValue(values, "degree"),
        school: textValue(values, "school"),
        university: textValue(values, "university"),
        fieldOfStudy: textValue(values, "fieldOfStudy"),
        startMonth: numberValue(values, "startMonth"),
        startYear: numberValue(values, "startYear"),
        endMonth: numberValue(values, "endMonth"),
        endYear: numberValue(values, "endYear"),
        grade: textValue(values, "grade"),
        description: textValue(values, "description"),
        skills: textValue(values, "skills"),
        activities: textValue(values, "activities"),
        schoolLogoUrl: textValue(values, "schoolLogoUrl"),
      })}
      validate={(values) =>
        requireText(values, "degree", "Degree") ??
        validateUrl(textValue(values, "schoolLogoUrl"), "School logo URL") ??
        validatePeriod(values)
      }
      renderSummary={(item) => (
        <>
          <h3>{item.degree || item.school}</h3>
          <p className="muted">{[item.school, item.university].filter(Boolean).join(" · ")}</p>
        </>
      )}
    />
  );
}

export function CredentialsView() {
  const session = useSession();
  if (!session) return null;
  return (
    <ResourceManager
      title="Licenses and certifications"
      singular="credential"
      description="Certificates and licenses, including optional verification links."
      userName={session.userName}
      load={adminApi.listCredentials}
      create={adminApi.createCredential}
      update={adminApi.updateCredential}
      remove={adminApi.deleteCredential}
      fields={[
        { name: "name", label: "Name", type: "text", required: true, span: "full" },
        { name: "issuingOrganisation", label: "Issuing organisation", type: "text", span: "full" },
        ...periodFields,
        { name: "credentialId", label: "Credential ID", type: "text" },
        { name: "orgLogoUrl", label: "Organisation logo URL", type: "url" },
        { name: "credentialUrl", label: "Verification URL", type: "url", span: "full" },
        { name: "landcUrl", label: "Certificate page URL", type: "url", span: "full" },
      ]}
      emptyValues={{
        name: "",
        issuingOrganisation: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        credentialId: "",
        orgLogoUrl: "",
        credentialUrl: "",
        landcUrl: "",
      }}
      toForm={(item: Credential) => ({
        name: displayValue(item.name),
        issuingOrganisation: displayValue(item.issuingOrganisation),
        ...periodValues(item),
        credentialId: displayValue(item.credentialId),
        orgLogoUrl: displayValue(item.orgLogoUrl),
        credentialUrl: displayValue(item.credentialUrl),
        landcUrl: displayValue(item.landcUrl),
      })}
      fromForm={(values) => ({
        name: textValue(values, "name"),
        issuingOrganisation: textValue(values, "issuingOrganisation"),
        startMonth: numberValue(values, "startMonth"),
        startYear: numberValue(values, "startYear"),
        endMonth: numberValue(values, "endMonth"),
        endYear: numberValue(values, "endYear"),
        credentialId: textValue(values, "credentialId"),
        credentialUrl: textValue(values, "credentialUrl"),
        landcUrl: textValue(values, "landcUrl"),
        orgLogoUrl: textValue(values, "orgLogoUrl"),
      })}
      validate={(values) =>
        requireText(values, "name", "Name") ??
        validateUrl(textValue(values, "credentialUrl"), "Verification URL") ??
        validateUrl(textValue(values, "landcUrl"), "Certificate page URL") ??
        validateUrl(textValue(values, "orgLogoUrl"), "Organisation logo URL") ??
        validatePeriod(values)
      }
      renderSummary={(item) => (
        <>
          <h3>{item.name}</h3>
          <p className="muted">{item.issuingOrganisation}</p>
        </>
      )}
    />
  );
}

export function LinksView() {
  const session = useSession();
  if (!session) return null;
  return (
    <ResourceManager
      title="Links"
      singular="link"
      description="Professional profiles and other public links."
      userName={session.userName}
      load={adminApi.listLinks}
      create={adminApi.createLink}
      update={adminApi.updateLink}
      remove={adminApi.deleteLink}
      fields={[
        { name: "platform", label: "Platform", type: "text", required: true, list: "platforms" },
        { name: "url", label: "URL", type: "url", required: true },
      ]}
      emptyValues={{ platform: "", url: "" }}
      toForm={(item: LinkItem) => ({ platform: displayValue(item.platform), url: displayValue(item.url) })}
      fromForm={(values) => ({ platform: textValue(values, "platform"), url: textValue(values, "url") })}
      validate={(values) =>
        requireText(values, "platform", "Platform") ??
        requireText(values, "url", "URL") ??
        validateUrl(textValue(values, "url"), "URL")
      }
      renderSummary={(item) => (
        <>
          <h3>{item.platform}</h3>
          <p className="muted">{item.url}</p>
        </>
      )}
      extra={
        <datalist id="platforms">
          <option value="GitHub" />
          <option value="LinkedIn" />
          <option value="Website" />
          <option value="Behance" />
        </datalist>
      }
    />
  );
}

export function ActivitiesView() {
  const session = useSession();
  if (!session) return null;
  return (
    <ResourceManager
      title="Activities"
      singular="activity"
      description="Talks, writing, community work, and other professional activity."
      userName={session.userName}
      load={adminApi.listActivities}
      create={adminApi.createActivity}
      update={adminApi.updateActivity}
      remove={adminApi.deleteActivity}
      fields={[
        { name: "activityDescription", label: "Description", type: "textarea", required: true },
        { name: "activityMediaUrl", label: "Media URL", type: "url", span: "full" },
      ]}
      emptyValues={{ activityDescription: "", activityMediaUrl: "" }}
      toForm={(item: Activity) => ({
        activityDescription: displayValue(item.activityDescription),
        activityMediaUrl: displayValue(item.activityMediaUrl),
      })}
      fromForm={(values) => ({
        activityDescription: textValue(values, "activityDescription"),
        activityMediaUrl: textValue(values, "activityMediaUrl"),
      })}
      validate={(values) =>
        requireText(values, "activityDescription", "Description") ??
        validateUrl(textValue(values, "activityMediaUrl"), "Media URL")
      }
      renderSummary={(item) => <p>{item.activityDescription}</p>}
    />
  );
}
