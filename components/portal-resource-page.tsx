"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, FileUp, LoaderCircle, Search, Trash2 } from "lucide-react";
import type { Role } from "@/lib/types";
import { ThemeToggle } from "@/components/theme-toggle";
import { portalSections } from "@/lib/portal-routes";

type Field = { key: string; label: string };
type ResourceConfig = {
  title: string;
  description: string;
  fields: Field[];
  canCreate?: boolean;
  canDelete?: boolean;
  readOnly?: boolean;
};
type RecordValue = Record<string, unknown>;

const config: Record<string, ResourceConfig> = {
  profile: {
    title: "Student profile",
    description: "Review and update your placement profile.",
    fields: [
      { key: "fullName", label: "Full name" }, { key: "universityUid", label: "University ID" },
      { key: "phoneNumber", label: "Phone" }, { key: "department", label: "Department" },
      { key: "degree", label: "Degree" }, { key: "specialisation", label: "Specialisation" },
      { key: "graduationYear", label: "Graduation year" }, { key: "currentSemester", label: "Semester" },
      { key: "cgpa", label: "CGPA" }, { key: "linkedInUrl", label: "LinkedIn URL" },
      { key: "githubUrl", label: "GitHub URL" }, { key: "portfolioUrl", label: "Portfolio URL" },
    ],
  },
  documents: { title: "Documents", description: "Upload and download your PDF resume. Files are limited to 2 MB.", fields: [] },
  companies: {
    title: "Companies", description: "Explore hiring organizations and manage company records.",
    fields: [{ key: "name", label: "Company name" }, { key: "industry", label: "Industry" }, { key: "location", label: "Location" }, { key: "description", label: "Description" }],
    canCreate: true, canDelete: true,
  },
  applications: {
    title: "Applications", description: "Track application progress and update authorized recruitment stages.",
    fields: [{ key: "company", label: "Company" }, { key: "role", label: "Role" }, { key: "status", label: "Status" }],
    canCreate: true, canDelete: true,
  },
  students: {
    title: "Student management", description: "Search and manage student placement records.",
    fields: [{ key: "name", label: "Student name" }, { key: "dept", label: "Department" }, { key: "cgpa", label: "CGPA" }, { key: "status", label: "Eligibility" }],
    canCreate: true, canDelete: true,
  },
  drives: {
    title: "Placement drives", description: "Create and track recruitment drives and deadlines.",
    fields: [{ key: "company", label: "Company" }, { key: "role", label: "Role" }, { key: "deadline", label: "Deadline" }, { key: "status", label: "Status" }],
    canCreate: true, canDelete: true,
  },
  compliance: {
    title: "Compliance queue", description: "Review verification items and close completed checks.",
    fields: [{ key: "title", label: "Task" }, { key: "detail", label: "Details" }, { key: "status", label: "Status" }],
    canCreate: true, canDelete: true,
  },
  analytics: { title: "Placement analytics", description: "Placement indicators available to authorized administrators.", fields: [], readOnly: true },
  candidates: {
    title: "Candidates", description: "Review eligible applicants and update their recruitment stage.",
    fields: [{ key: "name", label: "Candidate" }, { key: "dept", label: "Department" }, { key: "cgpa", label: "CGPA" }, { key: "stage", label: "Stage" }],
    canCreate: true, canDelete: true,
  },
  jobs: {
    title: "Job postings", description: "Create and manage roles for your authorized company account.",
    fields: [{ key: "title", label: "Role title" }, { key: "company", label: "Company" }, { key: "location", label: "Location" }, { key: "package", label: "Package" }, { key: "status", label: "Status" }],
    canCreate: true, canDelete: true,
  },
  interviews: {
    title: "Interviews", description: "Review scheduled interviews and add interview slots.",
    fields: [{ key: "candidate", label: "Candidate" }, { key: "role", label: "Role" }, { key: "slot", label: "Interview slot" }],
    canCreate: true, canDelete: true,
  },
  insights: { title: "Hiring insights", description: "Recruitment pipeline stage counts.", fields: [], readOnly: true },
  users: {
    title: "Platform users", description: "Review and manage user accounts and assigned roles.",
    fields: [{ key: "name", label: "Name" }, { key: "email", label: "Email" }, { key: "role", label: "Role" }, { key: "status", label: "Status" }],
    canCreate: true, canDelete: true,
  },
  institutions: {
    title: "Institutions", description: "Manage institutions registered on the platform.",
    fields: [{ key: "name", label: "Institution name" }, { key: "location", label: "Location" }, { key: "status", label: "Status" }],
    canCreate: true, canDelete: true,
  },
  permissions: {
    title: "Role permissions", description: "Review and adjust high-level role access descriptions.",
    fields: [{ key: "role", label: "Role" }, { key: "access", label: "Access summary" }],
    canCreate: true, canDelete: true,
  },
  settings: {
    title: "Platform settings", description: "Update platform profile and maintenance settings.",
    fields: [{ key: "institutionName", label: "Institution name" }, { key: "supportEmail", label: "Support email" }, { key: "maintenanceMode", label: "Maintenance mode (true/false)" }],
  },
  notifications: {
    title: "Notifications", description: "Review placement and recruitment updates.",
    fields: [{ key: "title", label: "Notification" }, { key: "detail", label: "Details" }, { key: "time", label: "Received" }],
    canDelete: true,
  },
};

function display(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Enabled" : "Disabled";
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

export function PortalResourcePage({ role, section }: { role: Role; section: string }) {
  const router = useRouter();
  const [data, setData] = useState<RecordValue | RecordValue[] | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<RecordValue[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const page = config[section];
  const records = useMemo(() => {
    const source = Array.isArray(data) ? data : data ? [data] : [];
    return searchResults ?? source;
  }, [data, searchResults]);

  const loadData = useCallback(async (query = "") => {
    try {
      const suffix = query ? `?search=${encodeURIComponent(query)}` : "";
      const response = await fetch(`/api/portal/${section}${suffix}`, { cache: "no-store" });
      const payload = await response.json() as { success?: boolean; message?: string; data?: RecordValue | RecordValue[] };
      if (response.status === 401) {
        router.replace("/login");
        return;
      }
      if (!response.ok || !payload.success || payload.data === undefined) {
        throw new Error(payload.message ?? "Unable to load this page.");
      }
      setError("");
      const loadedData = payload.data as RecordValue | RecordValue[];
      setData(loadedData);
      setSearchResults(null);
      if (!Array.isArray(loadedData)) {
        setFormValues(Object.fromEntries(page.fields.map(({ key }) => {
          const value = loadedData[key];
          return [key, typeof value === "boolean" ? String(value) : display(value)];
        })));
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load this page.");
    } finally {
      setLoading(false);
    }
  }, [page.fields, router, section]);

  useEffect(() => {
    let active = true;
    fetch(`/api/portal/${section}`, { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json() as { success?: boolean; message?: string; data?: RecordValue | RecordValue[] };
        if (response.status === 401) {
          router.replace("/login");
          throw new Error("Your session has expired.");
        }
        if (!response.ok || !payload.success || payload.data === undefined) {
          throw new Error(payload.message ?? "Unable to load this page.");
        }
        return payload.data;
      })
      .then((loadedData) => {
        if (!active) return;
        const normalized = loadedData as RecordValue | RecordValue[];
        setData(normalized);
        if (!Array.isArray(normalized)) {
          setFormValues(Object.fromEntries(page.fields.map(({ key }) => {
            const value = normalized[key];
            return [key, typeof value === "boolean" ? String(value) : display(value)];
          })));
        }
      })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "Unable to load this page.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [page.fields, router, section]);

  useEffect(() => {
    const timeout = window.setTimeout(async () => {
      if (!search.trim()) {
        setSearchResults(null);
        return;
      }
      try {
        const response = await fetch(`/api/portal/${section}?search=${encodeURIComponent(search.trim())}`, { cache: "no-store" });
        const payload = await response.json() as { success?: boolean; message?: string; data?: RecordValue | RecordValue[] };
        if (!response.ok || !payload.success) throw new Error(payload.message ?? "Search failed.");
        setSearchResults(Array.isArray(payload.data) ? payload.data : [payload.data as RecordValue]);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Search failed.");
      }
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [search, section]);

  async function mutate(method: "POST" | "PATCH" | "DELETE", body?: Record<string, unknown>, id?: string) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/portal/${section}${method === "DELETE" ? `?id=${encodeURIComponent(id ?? "")}` : ""}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: method === "DELETE" ? undefined : JSON.stringify(body ?? {}),
      });
      const payload = await response.json() as { success?: boolean; message?: string };
      if (!response.ok || !payload.success) throw new Error(payload.message ?? "The request could not be completed.");
      setNotice(payload.message ?? "Saved.");
      setShowCreateForm(false);
      await loadData(search);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The request could not be completed.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadFile(file?: File) {
    if (!file) return;
    if (file.type !== "application/pdf" || file.size > 2 * 1024 * 1024) {
      setError("Choose a PDF file smaller than 2 MB.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const contentBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("Unable to read this file."));
        reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
        reader.readAsDataURL(file);
      });
      const response = await fetch(`/api/portal/${section}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type, contentBase64 }),
      });
      const payload = await response.json() as { success?: boolean; message?: string };
      if (!response.ok || !payload.success) throw new Error(payload.message ?? "Resume upload failed.");
      setNotice(payload.message ?? "Resume uploaded.");
      await loadData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Resume upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function downloadFile(id: string) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/portal/${section}?download=${encodeURIComponent(id)}`);
      if (!response.ok) {
        const payload = await response.json() as { message?: string };
        throw new Error(payload.message ?? "Unable to download this document.");
      }
      const file = await response.blob();
      const url = URL.createObjectURL(file);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = records.find((item) => item.id === id)?.name?.toString() ?? "resume.pdf";
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to download this document.");
    } finally {
      setBusy(false);
    }
  }

  if (!page) return null;

  const dashboardPath = role === "super_admin" ? "/super-admin" : `/${role}`;
  const canCreate = Boolean(page.canCreate && section !== "applications");
  const isSingleRecord = !Array.isArray(data) && data !== null;

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-8 text-slate-900 lg:px-12">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <Link href={dashboardPath} className="mb-3 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> Back to overview
          </Link>
          <h1 className="text-3xl font-semibold tracking-[-0.05em]">{page.title}</h1>
          <p className="mt-2 text-sm text-slate-500">{page.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {canCreate && (
          <button type="button" onClick={() => setShowCreateForm((shown) => !shown)} className="rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1d2942]">
            {showCreateForm ? "Cancel" : `Add ${page.title.replace(/s$/, "")}`}
          </button>
          )}
        </div>
      </div>

      <nav aria-label="Portal sections" className="mb-6 flex gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2">
        {portalSections[role].map((item) => {
          const href = item.slug ? `${dashboardPath}/${item.slug}` : dashboardPath;
          const active = item.slug === section;
          return <Link key={item.slug || "overview"} href={href} aria-current={active ? "page" : undefined} className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm ${active ? "bg-[#111827] text-white" : "text-slate-600 hover:bg-slate-50"}`}>{item.label}</Link>;
        })}
      </nav>

      {error && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
      {notice && <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div>}

      {section === "documents" && (
        <section className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-5">
          <div>
            <h2 className="font-semibold">Upload a resume</h2>
            <p className="mt-1 text-sm text-slate-500">PDF only, maximum 2 MB.</p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white">
            {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
            Choose PDF
            <input type="file" accept="application/pdf" className="sr-only" disabled={busy} onChange={(event) => void uploadFile(event.target.files?.[0])} />
          </label>
        </section>
      )}

      {section === "applications" && role === "student" && (
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">Available opportunities</h2>
          <p className="mt-1 text-sm text-slate-500">Submit an application to move an eligible opportunity into your tracker.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {records.filter((item) => ["Not applied", "Eligible", "Hot", "Shortlist"].includes(String(item.status))).map((item) => (
              <button key={String(item.id)} disabled={busy} onClick={() => void mutate("POST", { opportunityId: item.id })} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:border-[#4263EB] disabled:opacity-50">
                Apply to {display(item.company)} · {display(item.role)}
              </button>
            ))}
          </div>
        </section>
      )}

      {section === "profile" && isSingleRecord && (
        <form className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2" onSubmit={(event) => {
          event.preventDefault();
          void mutate("PATCH", { updates: formValues });
        }}>
          {page.fields.map((field) => (
            <label key={field.key} className="grid gap-1.5 text-sm font-medium text-slate-700">
              {field.label}
              <input value={formValues[field.key] ?? ""} onChange={(event) => setFormValues((values) => ({ ...values, [field.key]: event.target.value }))} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-normal outline-none focus:border-[#4263EB]" />
            </label>
          ))}
          <button disabled={busy} type="submit" className="rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50">Save profile</button>
        </form>
      )}

      {section === "settings" && isSingleRecord && (
        <form className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2" onSubmit={(event) => {
          event.preventDefault();
          void mutate("PATCH", { updates: { ...formValues, maintenanceMode: formValues.maintenanceMode === "true" } });
        }}>
          {page.fields.map((field) => (
            <label key={field.key} className="grid gap-1.5 text-sm font-medium text-slate-700">
              {field.label}
              <input value={formValues[field.key] ?? ""} onChange={(event) => setFormValues((values) => ({ ...values, [field.key]: event.target.value }))} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-normal outline-none focus:border-[#4263EB]" />
            </label>
          ))}
          <button disabled={busy} type="submit" className="rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50">Save settings</button>
        </form>
      )}

      {showCreateForm && canCreate && (
        <form className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2" onSubmit={(event) => {
          event.preventDefault();
          const record = Object.fromEntries(page.fields.map(({ key }) => [key, formValues[key] ?? ""]));
          void mutate("POST", record);
          setFormValues({});
        }}>
          {page.fields.map((field) => (
            <label key={field.key} className="grid gap-1.5 text-sm font-medium text-slate-700">
              {field.label}
              <input required value={formValues[field.key] ?? ""} onChange={(event) => setFormValues((values) => ({ ...values, [field.key]: event.target.value }))} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-normal outline-none focus:border-[#4263EB]" />
            </label>
          ))}
          <button disabled={busy} type="submit" className="rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50">Save record</button>
        </form>
      )}

      {Array.isArray(data) && data.length > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${page.title.toLowerCase()}...`} className="w-full bg-transparent text-sm outline-none" />
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-12 text-sm text-slate-500"><LoaderCircle className="h-4 w-4 animate-spin" /> Loading {page.title.toLowerCase()}...</div>
        ) : error && !data ? (
          <div className="p-10 text-center"><p className="text-sm text-slate-600">{error}</p><button onClick={() => { setLoading(true); setError(""); void loadData(search); }} className="mt-3 text-sm font-semibold text-[#4263EB]">Try again</button></div>
        ) : records.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-medium">No {page.title.toLowerCase()} found</p>
            <p className="mt-1 text-sm text-slate-500">{search ? "Try a different search." : "New records will appear here when available."}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {records.map((record, index) => {
              const id = String(record.id ?? index);
              const readOnly = page.readOnly;
              return (
                <article key={id} className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold">{display(record.name ?? record.title ?? record.label ?? record.company ?? record.role ?? record.candidate ?? `Record ${index + 1}`)}</h2>
                    <div className="mt-2 grid gap-x-6 gap-y-1 text-sm text-slate-500 sm:grid-cols-2 xl:grid-cols-3">
                      {Object.entries(record)
                        .filter(([key]) => !["id", "contentBase64", "name", "title", "label", "company", "role", "candidate"].includes(key))
                        .map(([key, value]) => <p key={key}><span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>: {display(value)}</p>)}
                      {["company", "role", "candidate"].filter((key) => record[key] !== undefined).map((key) => <p key={key} className="capitalize">{key}: {display(record[key])}</p>)}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {section === "documents" && typeof record.id === "string" && (
                      <button onClick={() => void downloadFile(record.id as string)} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50"><Download className="h-3.5 w-3.5" /> Download</button>
                    )}
                    {section === "notifications" && record.read !== true && typeof record.id === "string" && (
                      <button onClick={() => void mutate("PATCH", { id: record.id, updates: { read: true } })} disabled={busy} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50">Mark read</button>
                    )}
                    {section !== "notifications" && record.status !== undefined && !readOnly && typeof record.id === "string" && (
                      <button onClick={() => void mutate("PATCH", { id: record.id, updates: { status: record.status === "Open" ? "Closed" : record.status === "Pending" ? "Approved" : "Open" } })} disabled={busy} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50">Update status</button>
                    )}
                    {page.canDelete && typeof record.id === "string" && (
                      <button aria-label={`Delete ${display(record.name ?? record.title ?? record.company)}`} onClick={() => void mutate("DELETE", undefined, record.id as string)} disabled={busy} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-red-200 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
