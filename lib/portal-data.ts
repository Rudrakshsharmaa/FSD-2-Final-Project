import {
  adminStudents,
  activityTimeline,
  companies,
  demoUsers,
  notifications,
  recruiterInterviews,
  recruiterPipeline,
  studentOpportunities,
  studentProfile,
  placementAnnouncements,
} from "@/lib/mock-data";

export type PortalRecord = Record<string, unknown>;

const initialData: Record<string, PortalRecord[] | PortalRecord> = {
  profile: { ...studentProfile },
  documents: [],
  companies: companies.map((company, index) => ({ id: `company-${index + 1}`, ...company })),
  applications: studentOpportunities.map((opportunity) => ({
    id: opportunity.id,
    company: opportunity.company,
    role: opportunity.role,
    package: opportunity.package,
    deadline: opportunity.deadline,
    status: opportunity.status === "Eligible" ? "Not applied" : opportunity.status,
  })),
  students: adminStudents.map((student, index) => ({ id: `student-${index + 1}`, ...student })),
  drives: studentOpportunities.map((opportunity) => ({
    id: opportunity.id,
    company: opportunity.company,
    role: opportunity.role,
    deadline: opportunity.deadline,
    status: "Open",
  })),
  compliance: [
    { id: "compliance-1", title: "Academic verification", detail: "7 student records need review", status: "Pending" },
    { id: "compliance-2", title: "Company approvals", detail: "2 company requests are waiting", status: "Pending" },
  ],
  analytics: [
    { id: "analytics-1", label: "Eligible students", value: "1,842", change: "+8.4%" },
    { id: "analytics-2", label: "Open opportunities", value: "142", change: "+14" },
    { id: "analytics-3", label: "Drive success", value: "81%", change: "+5.6%" },
  ],
  candidates: adminStudents.map((student, index) => ({ id: `candidate-${index + 1}`, ...student, company: "Apex Systems", stage: "Applied" })),
  jobs: studentOpportunities.map((opportunity) => ({
    id: opportunity.id,
    title: opportunity.role,
    company: opportunity.company,
    location: opportunity.location,
    package: opportunity.package,
    status: "Open",
  })),
  interviews: recruiterInterviews.map((interview, index) => ({ id: `interview-${index + 1}`, ...interview, company: "Apex Systems" })),
  insights: recruiterPipeline.map((stage, index) => ({ id: `insight-${index + 1}`, ...stage })),
  users: demoUsers.map(({ id, name, email, role }) => ({ id, name, email, role, status: "Active" })),
  institutions: [{ id: "institution-1", name: "CampusPulse Demo University", location: "India", status: "Active" }],
  permissions: [
    { id: "permission-student", role: "student", access: "Profile, documents, companies, applications" },
    { id: "permission-admin", role: "admin", access: "Students, drives, companies, reports" },
    { id: "permission-recruiter", role: "recruiter", access: "Jobs, authorised applicants, interviews" },
    { id: "permission-super-admin", role: "super_admin", access: "Platform-wide administration" },
  ],
  settings: { id: "platform-settings", institutionName: "CampusPulse Demo University", supportEmail: "support@campuspulse.edu", maintenanceMode: false },
  notifications: notifications.map((notification, index) => ({ id: `notification-${index + 1}`, ...notification, read: false })),
  activity: activityTimeline.map((activity, index) => ({ id: `activity-${index + 1}`, ...activity })),
  announcements: placementAnnouncements.map((announcement, index) => ({ id: `announcement-${index + 1}`, title: announcement })),
};

const data = structuredClone(initialData);

export const sectionRoles: Record<string, string[]> = {
  profile: ["student"],
  documents: ["student"],
  companies: ["student", "admin", "super_admin"],
  applications: ["student", "admin", "recruiter", "super_admin"],
  students: ["admin", "super_admin"],
  drives: ["admin", "super_admin"],
  compliance: ["admin", "super_admin"],
  analytics: ["admin", "super_admin"],
  candidates: ["recruiter"],
  jobs: ["recruiter"],
  interviews: ["recruiter"],
  insights: ["recruiter"],
  users: ["super_admin"],
  institutions: ["super_admin"],
  permissions: ["super_admin"],
  settings: ["super_admin"],
  notifications: ["student", "admin", "recruiter", "super_admin"],
  activity: ["student", "admin", "recruiter", "super_admin"],
  announcements: ["student", "admin", "super_admin"],
};

export function getPortalData(section: string) {
  const value = data[section];
  if (!value) return null;
  return structuredClone(value);
}

export function createPortalRecord(section: string, record: PortalRecord) {
  const current = data[section];
  if (!Array.isArray(current)) return null;
  const created = { ...record, id: crypto.randomUUID() };
  current.push(created);
  return created;
}

export function updatePortalRecord(section: string, id: string | undefined, updates: PortalRecord) {
  const current = data[section];
  if (!current) return null;

  if (!Array.isArray(current)) {
    const updated = { ...current, ...updates };
    data[section] = updated;
    return structuredClone(updated);
  }

  const index = current.findIndex((record) => record.id === id);
  if (index < 0) return null;
  current[index] = { ...current[index], ...updates };
  return structuredClone(current[index]);
}

export function deletePortalRecord(section: string, id: string) {
  const current = data[section];
  if (!Array.isArray(current)) return false;
  const index = current.findIndex((record) => record.id === id);
  if (index < 0) return false;
  current.splice(index, 1);
  return true;
}

export function getDocumentContent(id: string) {
  const current = data.documents;
  if (!Array.isArray(current)) return null;
  return current.find((record) => record.id === id) ?? null;
}
