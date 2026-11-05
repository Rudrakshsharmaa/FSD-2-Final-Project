"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Bell,
  Building2,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  Download,
  FileUp,
  GraduationCap,
  LogOut,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  activityTimeline,
  adminMetrics,
  adminStudents,
  companies,
  placementAnnouncements,
  recruiterInterviews,
  recruiterPipeline,
  roleLabels,
  studentOpportunities,
  studentProfile,
} from "@/lib/mock-data";
import type { PortalSession, Role } from "@/lib/types";
import { portalSections } from "@/lib/portal-routes";
import { ThemeToggle } from "@/components/theme-toggle";

const roleButtonMap: Record<Role, { title: string; subtitle: string }> = {
  student: {
    title: "Student",
    subtitle: "Access profile, resume records, opportunities and placement updates.",
  },
  admin: {
    title: "Placement admin",
    subtitle: "Review student and company activity, compliance and placement performance.",
  },
  recruiter: {
    title: "Recruiter",
    subtitle: "Manage candidate pipelines, drives and interview scheduling.",
  },
  super_admin: {
    title: "Super admin",
    subtitle: "Control institution settings, permissions and platform-wide governance.",
  },
};

const STORAGE_KEY = "campuspulse-session";

const profileSchema = z.object({
  fullName: z.string().min(2),
  universityUid: z.string().min(2),
  phoneNumber: z.string().min(8),
  department: z.string().min(2),
  degree: z.string().min(2),
  specialisation: z.string().min(2),
  graduationYear: z.string().min(4),
  currentSemester: z.string().min(2),
  cgpa: z.string().min(1),
  linkedInUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type DashboardRecord = Record<string, unknown> & { id?: string };

function usePortalData<T>(section: string, initialData: T) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`/api/portal/${section}`, { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json() as { success?: boolean; message?: string; data?: T };
      if (response.status === 401) {
        router.replace("/login");
        throw new Error("Your session has expired.");
      }
      if (!response.ok || !payload.success || payload.data === undefined) throw new Error(payload.message ?? "Unable to load dashboard data.");
        return payload.data;
      })
      .then((result) => {
        if (active) {
          setData(result);
          setError("");
        }
      })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "Unable to load dashboard data.");
      });
    return () => { active = false; };
  }, [router, section]);

  return { data, error };
}

function getSession(): PortalSession | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value) as PortalSession;
  } catch {
    return null;
  }
}

function renderStatusTone(value: string) {
  if (value === "Eligible" || value === "Open") return "bg-[#B9E6D3] text-[#111827]";
  if (value === "Hot" || value === "Shortlist" || value === "Interviewing") return "bg-[#E8EEFF] text-[#1d2942]";
  if (value === "Warning" || value === "Review") return "bg-[#FCE7E7] text-[#942d2d]";
  return "bg-slate-200 text-slate-700";
}

function StatCard({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-3xl font-semibold tracking-[-0.06em] text-[#111827]">{value}</p>
        <span className="rounded-full bg-[#B9E6D3] px-2 py-1 text-xs font-medium text-[#111827]">{delta}</span>
      </div>
    </div>
  );
}

function StudentOverview({ session }: { session: PortalSession }) {
  const router = useRouter();
  const [profileMessage, setProfileMessage] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const applications = usePortalData<DashboardRecord[]>("applications", studentOpportunities.map((item): DashboardRecord => ({ ...item })));
  const companyData = usePortalData<DashboardRecord[]>("companies", companies.map((item, index): DashboardRecord => ({ id: `company-${index + 1}`, ...item })));
  const notificationData = usePortalData<DashboardRecord[]>("notifications", []);
  const activityData = usePortalData<DashboardRecord[]>("activity", activityTimeline);
  const announcementData = usePortalData<DashboardRecord[]>("announcements", placementAnnouncements.map((title, index) => ({ id: `announcement-${index}`, title })));
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: studentProfile.fullName,
      universityUid: studentProfile.universityUid,
      phoneNumber: studentProfile.phoneNumber,
      department: studentProfile.department,
      degree: studentProfile.degree,
      specialisation: studentProfile.specialisation,
      graduationYear: studentProfile.graduationYear,
      currentSemester: studentProfile.currentSemester,
      cgpa: studentProfile.cgpa,
      linkedInUrl: studentProfile.linkedInUrl,
      githubUrl: studentProfile.githubUrl,
      portfolioUrl: studentProfile.portfolioUrl,
    },
  });

  useEffect(() => {
    let active = true;
    void fetch("/api/portal/profile", { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json() as { success?: boolean; message?: string; data?: ProfileFormValues };
        if (response.status === 401) {
          router.replace("/login");
          throw new Error("Your session has expired.");
        }
        if (!response.ok || !payload.success || !payload.data) throw new Error(payload.message ?? "Unable to load your profile.");
        if (active) form.reset(payload.data);
      })
      .catch((error: unknown) => {
        if (active) setProfileMessage(error instanceof Error ? error.message : "Unable to load your profile.");
      });
    return () => { active = false; };
  }, [form, router]);

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSavingProfile(true);
    setProfileMessage("");
    try {
      const response = await fetch("/api/portal/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: values }),
      });
      const payload = await response.json() as { success?: boolean; message?: string };
      if (!response.ok || !payload.success) throw new Error(payload.message ?? "Unable to save profile.");
      setProfileMessage(payload.message ?? "Profile saved.");
    } catch (error) {
      setProfileMessage(error instanceof Error ? error.message : "Unable to save profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Profile completion" value="84%" delta="+6%" />
        <StatCard label="Eligible roles" value={String(applications.data.filter((item) => item.status !== "Applied").length)} delta="See openings" />
        <StatCard label="Active applications" value={String(applications.data.filter((item) => item.status === "Applied" || item.status === "Interviewing").length)} delta="Live status" />
        <StatCard label="Unread notices" value={String(notificationData.data.filter((item) => item.read !== true).length)} delta="View updates" />
      </div>
      {(applications.error || companyData.error || notificationData.error || activityData.error || announcementData.error) && <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{applications.error || companyData.error || notificationData.error || activityData.error || announcementData.error}</p>}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Welcome back</p>
              <h2 className="mt-1 text-3xl font-semibold tracking-[-0.05em] text-[#111827]">{session.name}</h2>
            </div>
            <div className="rounded-full bg-[#B9E6D3] px-3 py-1.5 text-xs font-medium text-[#111827]">Student</div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {applications.data.map((job, index) => (
              <div key={String(job.id ?? index)} className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-[#111827]">{String(job.company ?? "Company")}</p>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${renderStatusTone(String(job.status ?? "Open"))}`}>{String(job.status ?? "Open")}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{String(job.role ?? "Placement opportunity")}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>{String(job.location ?? `Opportunity ${index + 1}`)}</span>
                  <span>{String(job.package ?? "")}</span>
                </div>
                <Link href="/student/applications" className="mt-4 inline-flex text-xs font-semibold text-[#4263EB] hover:underline">View application options</Link>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-[#111827]">Activity timeline</h3>
            <Sparkles className="h-4 w-4 text-[#4263EB]" />
          </div>
          <div className="mt-5 space-y-4">
            {activityData.data.map((entry, index) => (
              <div key={String(entry.id ?? entry.time ?? index)} className="flex gap-3 border-l border-slate-200 pl-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#4263EB]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{String(entry.time ?? "")}</p>
                  <p className="mt-1 text-sm text-slate-700">{String(entry.event ?? "")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-[#111827]">Student profile</h3>
            <ShieldCheck className="h-5 w-5 text-[#16845B]" />
          </div>
          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
            <input className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" {...form.register("fullName")} placeholder="Full Name" />
            <input className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" {...form.register("universityUid")} placeholder="University UID" />
            <input className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" {...form.register("phoneNumber")} placeholder="Phone Number" />
            <input className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" {...form.register("department")} placeholder="Department" />
            <input className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" {...form.register("degree")} placeholder="Degree" />
            <input className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" {...form.register("specialisation")} placeholder="Specialisation" />
            <input className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" {...form.register("graduationYear")} placeholder="Graduation Year" />
            <input className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" {...form.register("currentSemester")} placeholder="Current Semester" />
            <input className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" {...form.register("cgpa")} placeholder="CGPA" />
            <input className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:col-span-2" {...form.register("linkedInUrl")} placeholder="LinkedIn URL" />
            <input className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" {...form.register("githubUrl")} placeholder="GitHub URL" />
            <input className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" {...form.register("portfolioUrl")} placeholder="Portfolio URL" />
            <button type="submit" disabled={isSavingProfile} className="md:col-span-2 inline-flex items-center justify-center rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60">{isSavingProfile ? "Saving..." : "Save changes"}</button>
            {profileMessage && <p role="status" className="md:col-span-2 text-sm text-slate-600">{profileMessage}</p>}
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#111827]">Resume manager</h3>
              <FileUp className="h-5 w-5 text-[#4263EB]" />
            </div>
            <div className="mt-5 rounded-[22px] border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-600">
              <p className="font-medium text-[#111827]">Upload PDF resume</p>
              <p className="mt-2">Valid file type: PDF · Max size: 2 MB</p>
              <div className="mt-4 flex justify-center gap-3">
                <Link href="/student/documents" className="inline-flex items-center gap-2 rounded-xl bg-[#111827] px-3 py-2 text-xs font-medium text-white">
                  <FileUp className="h-3.5 w-3.5" /> Manage resumes
                </Link>
                <Link href="/student/documents" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700">
                  <Download className="h-3.5 w-3.5" /> View documents
                </Link>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {[
                { version: "v3.1 — Current CV", status: "Default" },
                { version: "v3.0 — Internship adaptation", status: "Archive" },
                { version: "v2.8 — Core technical profile", status: "Archive" },
              ].map((row) => (
                <div key={row.version} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm">
                  <span className="text-slate-700">{row.version}</span>
                  <span className="rounded-full bg-[#B9E6D3] px-2 py-1 text-[10px] font-medium text-[#111827]">{row.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-[#111827]">Announcements</h3>
            <div className="mt-5 space-y-3">
              {announcementData.data.map((item, index) => (
                <div key={String(item.id ?? index)} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                  {String(item.title ?? "")}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-[#111827]">Company explorer</h3>
          <Building2 className="h-5 w-5 text-[#4263EB]" />
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">Industry</div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">Location</div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">Job role</div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">Package range</div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {companyData.data.map((company) => (
            <div key={String(company.id ?? company.name)} className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-[#111827]">{String(company.name ?? "")}</p>
                  <p className="mt-1 text-sm text-slate-500">{String(company.industry ?? "")} • {String(company.location ?? "")}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${renderStatusTone(String(company.hiringStatus ?? "Open"))}`}>{String(company.hiringStatus ?? "Open")}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">{String(company.description ?? "")}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(Array.isArray(company.roles) ? company.roles : []).map((jobRole) => (
                  <span key={String(jobRole)} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600">{String(jobRole)}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminOverview() {
  const analytics = usePortalData<DashboardRecord[]>("analytics", adminMetrics);
  const students = usePortalData<DashboardRecord[]>("students", adminStudents);
  const compliance = usePortalData<DashboardRecord[]>("compliance", []);

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-4">
        {analytics.data.map((item, index) => (
          <StatCard key={String(item.id ?? item.label ?? index)} label={String(item.label ?? "Metric")} value={String(item.value ?? "—")} delta={String(item.change ?? item.delta ?? "")} />
        ))}
      </div>
      {(analytics.error || students.error || compliance.error) && <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{analytics.error || students.error || compliance.error}</p>}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-[#111827]">Candidate health check</h3>
          <div className="mt-5 space-y-4">
            {students.data.map((student, index) => (
              <div key={String(student.id ?? student.name ?? index)} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                <div>
                  <p className="font-medium text-[#111827]">{String(student.name ?? "")}</p>
                  <p className="text-xs text-slate-500">{String(student.dept ?? student.department ?? "")} • CGPA {String(student.cgpa ?? "—")}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${renderStatusTone(String(student.status ?? "Review"))}`}>{String(student.status ?? "Review")}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-[#111827]">Live compliance queue</h3>
          <div className="mt-5 space-y-4">
            {compliance.data.map((task, index) => (
              <div key={String(task.id ?? index)} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#16845B]" />
                <span>{String(task.title ?? task.detail ?? "Review item")}: {String(task.detail ?? task.status ?? "")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RecruiterOverview() {
  const pipeline = usePortalData<DashboardRecord[]>("insights", recruiterPipeline);
  const jobs = usePortalData<DashboardRecord[]>("jobs", []);
  const candidates = usePortalData<DashboardRecord[]>("candidates", []);
  const interviews = usePortalData<DashboardRecord[]>("interviews", recruiterInterviews);
  const openJobs = jobs.data.filter((job) => job.status === "Open").length;
  const shortlisted = candidates.data.filter((candidate) => candidate.stage === "Shortlisted" || candidate.stage === "Shortlist").length;
  const offers = candidates.data.filter((candidate) => candidate.stage === "Offer" || candidate.stage === "Offered").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Open jobs" value={String(openJobs)} delta="Current" />
        <StatCard label="Shortlists" value={String(shortlisted)} delta="Current" />
        <StatCard label="Interviews" value={String(interviews.data.length)} delta="Scheduled" />
        <StatCard label="Offers" value={String(offers)} delta="Current" />
      </div>
      {(pipeline.error || jobs.error || candidates.error || interviews.error) && <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{pipeline.error || jobs.error || candidates.error || interviews.error}</p>}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-[#111827]">Hiring pipeline</h3>
          <div className="mt-6 space-y-3">
            {pipeline.data.map((stage, index) => (
              <div key={String(stage.id ?? stage.name ?? index)}>
                <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                  <span>{String(stage.name ?? `Stage ${index + 1}`)}</span>
                  <span>{String(stage.value ?? 0)}</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100">
                  <div className="h-2.5 rounded-full bg-[#4263EB]" style={{ width: `${Math.min(100, (Number(stage.value ?? 0) / 240) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-[#111827]">Upcoming interviews</h3>
          <div className="mt-5 space-y-3">
            {interviews.data.map((candidate, index) => (
              <div key={String(candidate.id ?? candidate.candidate ?? index)} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="font-medium text-[#111827]">{String(candidate.candidate ?? "Candidate")}</p>
                <p className="mt-1 text-sm text-slate-600">{String(candidate.role ?? "")}</p>
                <p className="mt-2 text-xs text-slate-500">{String(candidate.slot ?? "")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SuperAdminOverview() {
  const users = usePortalData<DashboardRecord[]>("users", []);
  const institutions = usePortalData<DashboardRecord[]>("institutions", []);
  const permissions = usePortalData<DashboardRecord[]>("permissions", []);

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Platform users" value={String(users.data.length)} delta="All roles" />
        <StatCard label="Institutions" value={String(institutions.data.length)} delta="Registered" />
        <StatCard label="Role groups" value={String(permissions.data.length)} delta="Configured" />
        <StatCard label="System status" value="Online" delta="Healthy" />
      </div>
      {(users.error || institutions.error || permissions.error) && <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{users.error || institutions.error || permissions.error}</p>}
      <div className="grid gap-6 xl:grid-cols-2">
        <Link href="/super-admin/users" className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#4263EB]">
          <h2 className="text-xl font-semibold">Manage platform users</h2>
          <p className="mt-2 text-sm text-slate-500">Review accounts, roles, and active access.</p>
        </Link>
        <Link href="/super-admin/settings" className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#4263EB]">
          <h2 className="text-xl font-semibold">Platform configuration</h2>
          <p className="mt-2 text-sm text-slate-500">Update institution details and system settings.</p>
        </Link>
      </div>
    </div>
  );
}

function PortalDashboard({ role, session }: { role: Role; session: PortalSession }) {
  if (role === "student") return <StudentOverview session={session} />;
  if (role === "admin") return <AdminOverview />;
  if (role === "recruiter") return <RecruiterOverview />;
  return <SuperAdminOverview />;
}

export function CampusPortal({ role, mode }: { role: Role | null; mode: "login" | "portal" }) {
  const router = useRouter();
  const [session, setSession] = useState<PortalSession | null>(() => getSession());
  const [selectedPortal, setSelectedPortal] = useState<Role>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [portalError, setPortalError] = useState("");
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const activeRole = session?.role ?? role;

  const signOut = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("The server could not revoke the session.");
    } catch (error) {
      setPortalError(error instanceof Error ? `${error.message} Your browser session was cleared.` : "Logout failed on the server. Your browser session was cleared.");
    }

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setSession(null);
    setAccountMenuOpen(false);
    router.push("/login");
  };

  if (mode === "login") {
    return (
      <div className="min-h-screen bg-[#F7F6F2] px-6 py-12 text-[#111827]">
        <div className="mx-auto max-w-6xl rounded-[30px] border border-slate-200 bg-white/90 p-8 shadow-[0_30px_80px_rgba(17,24,39,0.08)]">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#4263EB]">CampusPulse access</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em]">Welcome back</h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Back to home</Link>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                {(["student", "admin", "recruiter", "super_admin"] as Role[]).map((portal) => (
                  <button
                    key={portal}
                    type="button"
                    onClick={() => setSelectedPortal(portal)}
                    className={`rounded-[24px] border p-4 text-left transition ${selectedPortal === portal ? "border-[#4263EB] bg-[#EEF3FF] shadow-sm" : "border-slate-200 bg-slate-50 hover:border-slate-300"}`}
                  >
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#111827] text-white">
                      {portal === "student" ? <GraduationCap className="h-5 w-5" /> : portal === "admin" ? <ShieldCheck className="h-5 w-5" /> : portal === "recruiter" ? <BriefcaseBusiness className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                    </div>
                    <p className="text-lg font-semibold text-[#111827]">{roleLabels[portal]}</p>
                    <p className="mt-2 text-xs text-slate-500">{roleButtonMap[portal].title}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[#4263EB]">Secure sign in</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#111827]">{roleLabels[selectedPortal]}</h2>
              </div>

              <form
                className="space-y-5"
                onSubmit={async (event) => {
                  event.preventDefault();
                  setIsSubmitting(true);
                  setLoginError("");
                  const formData = new FormData(event.currentTarget);
                  const email = String(formData.get("email") ?? "");
                  const password = String(formData.get("password") ?? "");

                  try {
                    const response = await fetch("/api/auth/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email, password, rememberMe: formData.get("rememberMe") === "on" }),
                    });
                    const payload = (await response.json()) as {
                      success?: boolean;
                      message?: string;
                      data?: { user?: { id: string; role: Role; name: string; email: string } };
                    };
                    if (!response.ok || !payload.success || !payload.data?.user) throw new Error(payload.message ?? "Authentication failed.");
                    if (payload.data.user.role !== selectedPortal) throw new Error(`This account belongs to the ${roleButtonMap[payload.data.user.role].title} portal.`);
                    const nextSession: PortalSession = payload.data.user;
                    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
                    setSession(nextSession);
                    router.push(nextSession.role === "super_admin" ? "/super-admin" : `/${nextSession.role}`);
                  } catch (error) {
                    setLoginError(error instanceof Error ? error.message : "Unable to sign in.");
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">University email</label>
                  <input id="email" name="email" type="email" autoComplete="username" required className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#4263EB]" placeholder="name@university.edu" />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
                    <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-xs font-medium text-[#4263EB]">{showPassword ? "Hide" : "Show"}</button>
                  </div>
                  <div className="relative">
                    <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#4263EB]" />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="rememberMe" defaultChecked className="h-4 w-4 rounded border-slate-300" />
                    Remember session
                  </label>
                  <Link href="/forgot-password" className="font-medium text-[#4263EB]">Forgot password?</Link>
                </div>

                {loginError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{loginError}</p>}
                <button type="submit" disabled={isSubmitting} className="w-full rounded-2xl bg-[#111827] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1d2942] disabled:cursor-not-allowed disabled:opacity-60">
                  {isSubmitting ? "Signing in..." : `Continue as ${roleButtonMap[selectedPortal].title}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session || activeRole !== role || !role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F6F2] px-6">
        <div className="max-w-md rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-[0_20px_50px_rgba(17,24,39,0.07)]">
          <p className="text-xs uppercase tracking-[0.18em] text-[#4263EB]">Access required</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#111827]">You need a valid role-based session.</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">A student must not access another student&apos;s private records without explicit authorization.</p>
          <Link href="/login" className="mt-6 inline-flex rounded-full bg-[#111827] px-5 py-3 text-sm font-medium text-white">Continue to login</Link>
        </div>
      </div>
    );
  }

  const navItems = portalSections[role];
  const portalPath = role === "super_admin" ? "/super-admin" : `/${role}`;
  const accountPath = role === "student"
    ? `${portalPath}/profile`
    : role === "super_admin"
      ? `${portalPath}/settings`
      : `${portalPath}/${role === "admin" ? "students" : "jobs"}`;

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#111827]">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between px-6 py-4 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111827] text-sm font-semibold text-[#F7F6F2]">CP</div>
            <div>
              <p className="text-lg font-semibold">CampusPulse</p>
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{roleLabels[role]}</p>
            </div>
          </div>

          <nav className="order-3 flex w-full items-center gap-5 overflow-x-auto py-2 md:order-none md:w-auto md:max-w-[50vw]" aria-label="Portal navigation">
            {navItems.map((item) => (
              <Link key={item.slug || "overview"} href={item.slug ? `${portalPath}/${item.slug}` : portalPath} className="whitespace-nowrap text-sm text-slate-600 transition hover:text-[#111827]">{item.label}</Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href={`${portalPath}/notifications`} aria-label="Notifications" className="rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"><Bell className="h-4 w-4" /></Link>
            <ThemeToggle />
            <div className="relative">
              <button type="button" aria-expanded={accountMenuOpen} onClick={() => setAccountMenuOpen((open) => !open)} className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B9E6D3] text-xs font-semibold text-[#111827]">{session.name.charAt(0)}</span>
                <span className="hidden text-left md:block">
                  <span className="block text-xs font-medium text-[#111827]">{session.name}</span>
                  <span className="block text-[10px] text-slate-500">{session.email}</span>
                </span>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </button>
              {accountMenuOpen && (
                <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  <Link href={accountPath} onClick={() => setAccountMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">{role === "student" ? "My profile" : role === "super_admin" ? "Platform settings" : "Workspace"}</Link>
                </div>
              )}
            </div>
            <button type="button" onClick={() => void signOut()} className="inline-flex items-center gap-2 rounded-full bg-[#111827] px-3 py-2 text-xs font-medium text-white">
              <LogOut className="h-3.5 w-3.5" /><span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-12">
        {portalError && <p role="status" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{portalError}</p>}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mb-6 flex flex-col gap-4 rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#4263EB]">Live dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#111827]">
              {role === "student" ? `Welcome back, ${session.name.split(" ")[0]}` : role === "admin" ? "Placement control center" : role === "recruiter" ? "Recruiter workspace" : "Platform administration"}
            </h1>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#B9E6D3] px-3 py-1.5 text-xs font-medium text-[#111827]">
            <span className="h-2 w-2 rounded-full bg-[#16845B]" /> Real-time sync active
          </div>
        </motion.div>

        <PortalDashboard role={role} session={session} />
      </main>
    </div>
  );
}
