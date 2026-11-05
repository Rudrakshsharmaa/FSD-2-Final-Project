import type { Role } from "@/lib/types";

export const portalSections: Record<Role, { label: string; slug: string }[]> = {
  student: [
    { label: "Overview", slug: "" },
    { label: "Profile", slug: "profile" },
    { label: "Documents", slug: "documents" },
    { label: "Companies", slug: "companies" },
    { label: "Applications", slug: "applications" },
    { label: "Notifications", slug: "notifications" },
  ],
  admin: [
    { label: "Overview", slug: "" },
    { label: "Students", slug: "students" },
    { label: "Companies", slug: "companies" },
    { label: "Drives", slug: "drives" },
    { label: "Applications", slug: "applications" },
    { label: "Compliance", slug: "compliance" },
    { label: "Analytics", slug: "analytics" },
    { label: "Notifications", slug: "notifications" },
  ],
  recruiter: [
    { label: "Overview", slug: "" },
    { label: "Candidates", slug: "candidates" },
    { label: "Jobs", slug: "jobs" },
    { label: "Interviews", slug: "interviews" },
    { label: "Applications", slug: "applications" },
    { label: "Insights", slug: "insights" },
    { label: "Notifications", slug: "notifications" },
  ],
  super_admin: [
    { label: "Overview", slug: "" },
    { label: "Users", slug: "users" },
    { label: "Institutions", slug: "institutions" },
    { label: "Permissions", slug: "permissions" },
    { label: "Settings", slug: "settings" },
    { label: "Analytics", slug: "analytics" },
    { label: "Notifications", slug: "notifications" },
  ],
};

export const allPortalRoles = Object.keys(portalSections) as Role[];
