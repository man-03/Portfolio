import { apiRequest, apiRequestBlob } from "@/services/api-client";
import type {
  Activity,
  ActivityRequest,
  AdminProfile,
  AdminProfileRequest,
  ApiResponse,
  Contact,
  ContactRequest,
  Credential,
  CredentialRequest,
  Education,
  EducationRequest,
  Experience,
  ExperienceRequest,
  LinkItem,
  LinkRequest,
  Project,
  ProjectRequest,
  ResumeMeta,
  SkillsAggregate,
  SkillsRequest,
} from "@/types/portfolio";

function profilePath(userName: string) {
  return `/api/admin/${encodeURIComponent(userName)}`;
}

function collectionPath(userName: string, resource: string, id?: number) {
  const base = `/api/admin/${encodeURIComponent(userName)}/${resource}`;
  return id === undefined ? base : `${base}/${id}`;
}

export const adminApi = {
  getProfile(userName: string) {
    return apiRequest<AdminProfile>(profilePath(userName), { auth: true });
  },
  createProfile(userName: string, body: AdminProfileRequest) {
    return apiRequest<ApiResponse>(profilePath(userName), { method: "POST", auth: true, body });
  },
  updateProfile(userName: string, body: AdminProfileRequest) {
    return apiRequest<ApiResponse>(profilePath(userName), { method: "PUT", auth: true, body });
  },
  deleteProfile(userName: string) {
    return apiRequest<ApiResponse>(profilePath(userName), { method: "DELETE", auth: true });
  },
  getSkills(userName: string) {
    return apiRequest<SkillsAggregate>(collectionPath(userName, "skills"), { auth: true });
  },
  createSkills(userName: string, body: SkillsRequest) {
    return apiRequest<SkillsAggregate>(collectionPath(userName, "skills"), {
      method: "POST",
      auth: true,
      body,
    });
  },
  updateSkills(userName: string, body: SkillsRequest) {
    return apiRequest<SkillsAggregate>(collectionPath(userName, "skills"), {
      method: "PUT",
      auth: true,
      body,
    });
  },
  listProjects(userName: string) {
    return apiRequest<Project[]>(collectionPath(userName, "project"), { auth: true });
  },
  createProject(userName: string, body: ProjectRequest) {
    return apiRequest<ApiResponse>(collectionPath(userName, "project"), { method: "POST", auth: true, body });
  },
  updateProject(userName: string, id: number, body: ProjectRequest) {
    return apiRequest<ApiResponse>(collectionPath(userName, "project", id), { method: "PUT", auth: true, body });
  },
  deleteProject(userName: string, id: number) {
    return apiRequest<ApiResponse>(collectionPath(userName, "project", id), { method: "DELETE", auth: true });
  },
  listEducation(userName: string) {
    return apiRequest<Education[]>(collectionPath(userName, "education"), { auth: true });
  },
  createEducation(userName: string, body: EducationRequest) {
    return apiRequest<ApiResponse>(collectionPath(userName, "education"), { method: "POST", auth: true, body });
  },
  updateEducation(userName: string, id: number, body: EducationRequest) {
    return apiRequest<ApiResponse>(collectionPath(userName, "education", id), { method: "PUT", auth: true, body });
  },
  deleteEducation(userName: string, id: number) {
    return apiRequest<ApiResponse>(collectionPath(userName, "education", id), { method: "DELETE", auth: true });
  },
  listExperience(userName: string) {
    return apiRequest<Experience[]>(collectionPath(userName, "experience"), { auth: true });
  },
  createExperience(userName: string, body: ExperienceRequest) {
    return apiRequest<ApiResponse>(collectionPath(userName, "experience"), { method: "POST", auth: true, body });
  },
  updateExperience(userName: string, id: number, body: ExperienceRequest) {
    return apiRequest<ApiResponse>(collectionPath(userName, "experience", id), {
      method: "PUT",
      auth: true,
      body,
    });
  },
  deleteExperience(userName: string, id: number) {
    return apiRequest<ApiResponse>(collectionPath(userName, "experience", id), { method: "DELETE", auth: true });
  },
  listCredentials(userName: string) {
    return apiRequest<Credential[]>(collectionPath(userName, "credential"), { auth: true });
  },
  createCredential(userName: string, body: CredentialRequest) {
    return apiRequest<ApiResponse>(collectionPath(userName, "credential"), { method: "POST", auth: true, body });
  },
  updateCredential(userName: string, id: number, body: CredentialRequest) {
    return apiRequest<ApiResponse>(collectionPath(userName, "credential", id), { method: "PUT", auth: true, body });
  },
  deleteCredential(userName: string, id: number) {
    return apiRequest<ApiResponse>(collectionPath(userName, "credential", id), { method: "DELETE", auth: true });
  },
  listLinks(userName: string) {
    return apiRequest<LinkItem[]>(collectionPath(userName, "link"), { auth: true });
  },
  createLink(userName: string, body: LinkRequest) {
    return apiRequest<ApiResponse>(collectionPath(userName, "link"), { method: "POST", auth: true, body });
  },
  updateLink(userName: string, id: number, body: LinkRequest) {
    return apiRequest<ApiResponse>(collectionPath(userName, "link", id), { method: "PUT", auth: true, body });
  },
  deleteLink(userName: string, id: number) {
    return apiRequest<ApiResponse>(collectionPath(userName, "link", id), { method: "DELETE", auth: true });
  },
  listActivities(userName: string) {
    return apiRequest<Activity[]>(collectionPath(userName, "activity"), { auth: true });
  },
  createActivity(userName: string, body: ActivityRequest) {
    return apiRequest<ApiResponse>(collectionPath(userName, "activity"), { method: "POST", auth: true, body });
  },
  updateActivity(userName: string, id: number, body: ActivityRequest) {
    return apiRequest<ApiResponse>(collectionPath(userName, "activity", id), { method: "PUT", auth: true, body });
  },
  deleteActivity(userName: string, id: number) {
    return apiRequest<ApiResponse>(collectionPath(userName, "activity", id), { method: "DELETE", auth: true });
  },
  getContact(userName: string) {
    return apiRequest<Contact>(collectionPath(userName, "contact"), { auth: true });
  },
  createContact(userName: string, body: ContactRequest) {
    return apiRequest<ApiResponse>(collectionPath(userName, "contact"), { method: "POST", auth: true, body });
  },
  updateContact(userName: string, id: number, body: ContactRequest) {
    return apiRequest<ApiResponse>(collectionPath(userName, "contact", id), { method: "PUT", auth: true, body });
  },
  deleteContact(userName: string, id: number) {
    return apiRequest<ApiResponse>(collectionPath(userName, "contact", id), { method: "DELETE", auth: true });
  },
  getResume(userName: string) {
    return apiRequest<ResumeMeta>(collectionPath(userName, "resume"), { auth: true });
  },
  uploadResume(userName: string, file: File) {
    const formData = new FormData();
    formData.set("file", file);
    return apiRequest<ResumeMeta>(collectionPath(userName, "resume"), {
      method: "POST",
      auth: true,
      formData,
    });
  },
  replaceResume(userName: string, id: number, file: File) {
    const formData = new FormData();
    formData.set("file", file);
    return apiRequest<ResumeMeta>(collectionPath(userName, "resume", id), {
      method: "PUT",
      auth: true,
      formData,
    });
  },
  deleteResume(userName: string, id: number) {
    return apiRequest<string>(collectionPath(userName, "resume", id), { method: "DELETE", auth: true });
  },
  viewResume(userName: string, id: number) {
    return apiRequestBlob(`${collectionPath(userName, "resume", id)}/file`, { auth: true });
  },
};
