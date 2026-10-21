export type ApiResponse = {
  success: string;
  message: string;
};

export type LoginResponse = {
  token: string;
  userName: string;
};

export type Address = {
  id?: number;
  address: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  zip: string | null;
};

export type AddressRequest = {
  address: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  zip: string | null;
};

export type AdminProfile = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  pronoun: string | null;
  currentPosition: string | null;
  myQuote: string | null;
  headLine: string | null;
  about: string | null;
  profileImageUrl: string | null;
  adminAddressResponseDTO: Address | null;
};

export type AdminProfileRequest = {
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  pronoun: string | null;
  currentPosition: string | null;
  myQuote: string | null;
  headLine: string | null;
  about: string | null;
  profileImageUrl: string | null;
  adminAddressRequestDTO: AddressRequest | null;
};

export type Contact = {
  id: number;
  email: string | null;
  phone: string | null;
};

export type ContactRequest = {
  email: string | null;
  phone: string | null;
};

export type ContactFormRequest = {
  name: string;
  email: string;
  message: string;
};

export type LinkItem = {
  id: number;
  platform: string | null;
  url: string | null;
};

export type LinkRequest = {
  platform: string | null;
  url: string | null;
};

export type Experience = {
  id: number;
  title: string | null;
  employmentType: string | null;
  company: string | null;
  startMonth: number | null;
  startYear: number | null;
  endMonth: number | null;
  endYear: number | null;
  currentlyWorking: boolean | null;
  location: string | null;
  locationType: string | null;
  description: string | null;
  companyLogoUrl: string | null;
};

export type ExperienceRequest = Omit<Experience, "id">;

export type Project = {
  id: number;
  title: string | null;
  projectDescription: string | null;
  rolesAndResponsibilities: string | null;
  startMonth: number | null;
  startYear: number | null;
  endMonth: number | null;
  endYear: number | null;
  techStack: string | null;
};

export type ProjectRequest = Omit<Project, "id">;

export type Education = {
  id: number;
  degree: string | null;
  school: string | null;
  university: string | null;
  fieldOfStudy: string | null;
  startMonth: number | null;
  startYear: number | null;
  endMonth: number | null;
  endYear: number | null;
  grade: string | null;
  description: string | null;
  skills: string | null;
  activities: string | null;
  schoolLogoUrl: string | null;
};

export type EducationRequest = Omit<Education, "id">;

export type Credential = {
  id: number;
  name: string | null;
  issuingOrganisation: string | null;
  startMonth: number | null;
  startYear: number | null;
  endMonth: number | null;
  endYear: number | null;
  credentialId: string | null;
  credentialUrl: string | null;
  landcUrl: string | null;
  orgLogoUrl: string | null;
};

export type CredentialRequest = Omit<Credential, "id">;

export type Skill = {
  id: number;
  skill: string | null;
  categoryId: number | null;
};

export type SkillCategory = {
  id: number;
  category: string | null;
  skills: Skill[] | null;
};

export type SkillsAggregate = {
  categories: SkillCategory[] | null;
};

export type SkillRequest = {
  id?: number;
  skill: string | null;
};

export type SkillCategoryRequest = {
  id?: number;
  category: string | null;
  skills: SkillRequest[] | null;
};

export type SkillsRequest = {
  categories: SkillCategoryRequest[];
};

export type Activity = {
  id: number;
  activityDescription: string | null;
  activityMediaUrl: string | null;
};

export type ActivityRequest = {
  activityDescription: string | null;
  activityMediaUrl: string | null;
};

export type ResumeMeta = {
  id: number;
  fileName: string | null;
  contentType: string | null;
  fileSize: number | null;
  uploadedAt: string | number[] | null;
};

export type Portfolio = {
  admin: AdminProfile;
  contact: Contact | null;
  link: LinkItem[] | null;
  experience: Experience[] | null;
  project: Project[] | null;
  education: Education[] | null;
  licenseAndCertification: Credential[] | null;
  skills: SkillsAggregate | null;
  activity: Activity[] | null;
  resume: ResumeMeta | null;
};
