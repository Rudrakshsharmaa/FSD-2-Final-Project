import type { CompanyRecord, NotificationItem, Opportunity, Role, StudentProfile } from "@/lib/types";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
};

export const roleLabels: Record<Role, string> = {
  student: "Student Portal",
  admin: "Placement Cell",
  recruiter: "Recruiter Portal",
  super_admin: "Super Admin",
};

export const demoUsers: DemoUser[] = [
  { id: "student-1", name: "Aarav Mehta", email: "aarav.mehta@campus.edu.in", password: "password123", role: "student" },
  { id: "admin-1", name: "Meera Nair", email: "meera.nair@campus.edu", password: "password123", role: "admin" },
  { id: "recruiter-1", name: "Rishi Agrawal", email: "rishi.agrawal@recruiter.io", password: "password123", role: "recruiter" },
  { id: "super-admin-1", name: "Aisha Rao", email: "aisha.rao@campuspulse.edu", password: "password123", role: "super_admin" },
];

export const studentProfile: StudentProfile = {
  fullName: "Aarav Mehta",
  universityUid: "BTECH-CS-2025-184",
  universityEmail: "aarav.mehta@campus.edu.in",
  phoneNumber: "+91 98765 43210",
  department: "Computer Science & Engineering",
  degree: "B.Tech",
  specialisation: "AI & Data Systems",
  graduationYear: "2025",
  currentSemester: "7th Semester",
  cgpa: "8.9",
  backlogCount: 1,
  activeBacklogCount: 0,
  technicalSkills: ["TypeScript", "Python", "React", "Node.js", "SQL", "System Design"],
  softSkills: ["Leadership", "Communication", "Problem Solving", "Stakeholder Management"],
  projects: [
    "CampusPulse Recruitment Intelligence Dashboard",
    "AI Career Readiness Agent",
    "Supply Chain Optimization Platform",
  ],
  certifications: ["AWS Cloud Practitioner", "Google Data Analytics", "Meta Front-End Certificate"],
  internshipExperience: [
    "Software Engineer Intern — NorthStar Analytics",
    "Product Engineering Intern — Finora Labs",
  ],
  linkedInUrl: "https://linkedin.com/in/aaravmehta",
  githubUrl: "https://github.com/aaravmehta",
  portfolioUrl: "https://aaravmehta.design",
};

export const studentOpportunities: Opportunity[] = [
  {
    id: "opp-1",
    company: "Apex Systems",
    role: "Software Engineer I",
    package: "₹18.5 LPA",
    location: "Bengaluru",
    type: "Full-Time",
    deadline: "12 Jul 2025",
    eligibility: "CGPA 8.0+, No active backlogs",
    status: "Eligible",
  },
  {
    id: "opp-2",
    company: "Nexa Cloud",
    role: "Frontend Engineer",
    package: "₹22 LPA",
    location: "Hyderabad",
    type: "Full-Time",
    deadline: "18 Jul 2025",
    eligibility: "2025 batch, 2 rounds cleared",
    status: "Hot",
  },
  {
    id: "opp-3",
    company: "ByteForge",
    role: "Data Engineer",
    package: "₹15.8 LPA",
    location: "Pune",
    type: "Full-Time",
    deadline: "23 Jul 2025",
    eligibility: "Strong SQL + Python skills",
    status: "Shortlist",
  },
];

export const companies: CompanyRecord[] = [
  {
    name: "Apex Systems",
    industry: "Enterprise Software",
    website: "https://apexsystems.ai",
    location: "Bengaluru, India",
    roles: ["Software Engineer", "Product Analyst", "QA Automation"],
    package: "₹18-25 LPA",
    hiringStatus: "Open",
    students: 42,
    description: "Builds workflow intelligence and automation for enterprise teams.",
  },
  {
    name: "Nexa Cloud",
    industry: "Cloud Infrastructure",
    website: "https://nexa.cloud",
    location: "Hyderabad, India",
    roles: ["Frontend Engineer", "Platform Engineer", "DevOps"],
    package: "₹20-30 LPA",
    hiringStatus: "Interviewing",
    students: 28,
    description: "Owns high-scale developer tooling and managed cloud experiences.",
  },
  {
    name: "ByteForge",
    industry: "Fintech",
    website: "https://byteforge.com",
    location: "Pune, India",
    roles: ["Data Engineer", "Business Analyst", "Security Engineer"],
    package: "₹15-22 LPA",
    hiringStatus: "Open",
    students: 31,
    description: "Creates AI-driven frameworks for financial operations and risk insights.",
  },
  {
    name: "Saffron Labs",
    industry: "HealthTech",
    website: "https://saffronlabs.io",
    location: "Chennai, India",
    roles: ["ML Engineer", "Product Engineer"],
    package: "₹17-23 LPA",
    hiringStatus: "Closed",
    students: 18,
    description: "Designs healthcare systems for patient engagement and predictive care.",
  },
];

export const notifications: NotificationItem[] = [
  {
    title: "Resume reviewed",
    detail: "Your resume for Apex Systems has been shortlisted for the technical panel.",
    time: "2h ago",
    tone: "success",
  },
  {
    title: "Drive update",
    detail: "Nexa Cloud hiring drive is scheduled for Tuesday, 10:00 AM.",
    time: "5h ago",
    tone: "neutral",
  },
  {
    title: "Profile alert",
    detail: "Academic verification pending for active backlog record.",
    time: "1d ago",
    tone: "warning",
  },
];

export const adminMetrics = [
  { label: "Eligible Students", value: "1,842", delta: "+8.4%" },
  { label: "Open Opportunities", value: "142", delta: "+14" },
  { label: "Drive Success", value: "81%", delta: "+5.6%" },
  { label: "Pending Verifications", value: "37", delta: "-9" },
];

export const recruiterPipeline = [
  { name: "Applied", value: 240 },
  { name: "Screened", value: 180 },
  { name: "Shortlisted", value: 122 },
  { name: "Interviewing", value: 64 },
  { name: "Offers", value: 18 },
];

export const activityTimeline = [
  { time: "09:15", event: "Nexa Cloud posted a new frontend role." },
  { time: "11:30", event: "14 students cleared the aptitude round." },
  { time: "14:05", event: "Resume verification completed for 7 candidates." },
  { time: "16:20", event: "Apex Systems scheduled final interviews." },
];

export const placementAnnouncements = [
  "Data Science hiring drive opens for 2025 graduates.",
  "Apex Systems panel visit confirmed for 12 July.",
  "Resume verification window closes soon for selected sectors.",
];

export const roleNavigation: Record<Role, string[]> = {
  student: ["Overview", "Profile", "Documents", "Companies", "Applications"],
  admin: ["Overview", "Students", "Drives", "Compliance", "Analytics"],
  recruiter: ["Overview", "Candidates", "Jobs", "Interviews", "Insights"],
  super_admin: ["Overview", "Users", "Institutions", "Permissions", "Settings"],
};

export const adminStudents = [
  { name: "Aarav Mehta", dept: "CSE", cgpa: "8.9", status: "Eligible" },
  { name: "Nisha Iyer", dept: "ECE", cgpa: "8.4", status: "Eligible" },
  { name: "Ishaan Shah", dept: "IT", cgpa: "7.9", status: "Review" },
  { name: "Rhea Thomas", dept: "ME", cgpa: "8.6", status: "Eligible" },
];

export const recruiterInterviews = [
  { candidate: "Aarav Mehta", role: "Frontend Engineer", slot: "Tue, 10:30 AM" },
  { candidate: "Nisha Iyer", role: "Product Analyst", slot: "Tue, 12:15 PM" },
  { candidate: "Harsh Singh", role: "SDE", slot: "Wed, 9:30 AM" },
];

export const faqItems = [
  {
    question: "How does CampusPulse support three distinct user groups?",
    answer:
      "Each role is assigned a dedicated portal with access rules, dashboards, and permissions that align with student, TPO, and recruiter workflows.",
  },
  {
    question: "Can we connect real recruitment data later?",
    answer:
      "Yes. The current build uses a demo dataset and a Supabase-ready architecture so real student, company, and placement records can be connected securely later.",
  },
  {
    question: "Are student records protected by access controls?",
    answer:
      "Student records are restricted to the logged-in user and TPO-approved administrators, with privacy safeguards built into the layout and data model.",
  },
];
