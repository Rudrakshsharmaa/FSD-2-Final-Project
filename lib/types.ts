export type Role = "student" | "admin" | "recruiter" | "super_admin";

export type PortalSession = {
  id?: string;
  role: Role;
  name: string;
  email: string;
};

export type UserSession = {
  id: string;
  role: Role;
  name: string;
  email: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  error?: {
    code?: string;
    details?: Record<string, unknown>;
  };
};

export interface Opportunity {
  id: string;
  company: string;
  role: string;
  package: string;
  location: string;
  type: string;
  deadline: string;
  eligibility: string;
  status: "Eligible" | "Hot" | "Shortlist" | "Applied";
}

export interface CompanyRecord {
  name: string;
  industry: string;
  website: string;
  location: string;
  roles: string[];
  package: string;
  hiringStatus: "Open" | "Interviewing" | "Closed";
  students: number;
  description: string;
}

export interface NotificationItem {
  title: string;
  detail: string;
  time: string;
  tone: "neutral" | "success" | "warning";
}

export interface StudentProfile {
  fullName: string;
  universityUid: string;
  universityEmail: string;
  phoneNumber: string;
  department: string;
  degree: string;
  specialisation: string;
  graduationYear: string;
  currentSemester: string;
  cgpa: string;
  backlogCount: number;
  activeBacklogCount: number;
  technicalSkills: string[];
  softSkills: string[];
  projects: string[];
  certifications: string[];
  internshipExperience: string[];
  linkedInUrl: string;
  githubUrl: string;
  portfolioUrl: string;
}
