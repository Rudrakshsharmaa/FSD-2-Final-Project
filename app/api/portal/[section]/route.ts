import { NextResponse } from "next/server";

import { getSessionFromRequest } from "@/lib/auth";
import {
  createPortalRecord,
  deletePortalRecord,
  getDocumentContent,
  getPortalData,
  sectionRoles,
  updatePortalRecord,
  type PortalRecord,
} from "@/lib/portal-data";

type RouteContext = { params: Promise<{ section: string }> };
const RECRUITER_COMPANY = "Apex Systems";

const mutationRoles: Record<string, string[]> = {
  profile: ["student"],
  documents: ["student"],
  companies: ["admin", "super_admin"],
  applications: ["admin", "recruiter", "super_admin"],
  students: ["admin", "super_admin"],
  drives: ["admin", "super_admin"],
  compliance: ["admin", "super_admin"],
  analytics: [],
  candidates: ["recruiter"],
  jobs: ["recruiter"],
  interviews: ["recruiter"],
  insights: [],
  users: ["super_admin"],
  institutions: ["super_admin"],
  permissions: ["super_admin"],
  settings: ["super_admin"],
  notifications: ["student", "admin", "recruiter", "super_admin"],
  activity: [],
  announcements: [],
};

function failure(message: string, code: string, status: number) {
  return NextResponse.json({ success: false, message, error: { code } }, { status });
}

async function authorize(request: Request, context: RouteContext) {
  const { section } = await context.params;
  const session = getSessionFromRequest(request);
  if (!session) return { error: failure("Authentication required.", "UNAUTHENTICATED", 401) } as const;
  const roles = sectionRoles[section];
  if (!roles) return { error: failure("This portal page does not exist.", "NOT_FOUND", 404) } as const;
  if (!roles.includes(session.role)) return { error: failure("You do not have permission to access this resource.", "FORBIDDEN", 403) } as const;
  return { section, session } as const;
}

function canMutate(section: string, role: string, method: "POST" | "PATCH" | "DELETE") {
  if (section === "applications" && method === "POST" && role === "student") return true;
  return mutationRoles[section]?.includes(role) ?? false;
}

function belongsToRecruiter(section: string, id: string) {
  const value = getPortalData(section);
  return Array.isArray(value) && value.some((record) => record.id === id && record.company === RECRUITER_COMPANY);
}

function validateRecord(value: unknown): PortalRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const entries = Object.entries(value);
  if (entries.length === 0 || entries.length > 30) return null;

  const record: PortalRecord = {};
  for (const [key, field] of entries) {
    if (!/^[a-zA-Z][a-zA-Z0-9_]{0,49}$/.test(key) || key === "id" || key === "contentBase64") return null;
    if (typeof field === "string" && field.length <= 2000) record[key] = field.trim();
    else if (typeof field === "boolean" || (typeof field === "number" && Number.isFinite(field))) record[key] = field;
    else return null;
  }
  return record;
}

export async function GET(request: Request, context: RouteContext) {
  const access = await authorize(request, context);
  if ("error" in access) return access.error;

  const url = new URL(request.url);
  const id = url.searchParams.get("download");
  if (access.section === "documents" && id) {
    const document = getDocumentContent(id);
    if (!document || typeof document.contentBase64 !== "string" || typeof document.name !== "string") {
      return failure("Document not found.", "NOT_FOUND", 404);
    }
    const bytes = Buffer.from(document.contentBase64, "base64");
    return new Response(bytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${document.name.replace(/["\\\r\n]/g, "_")}"`,
        "Content-Length": String(bytes.length),
        "Cache-Control": "no-store",
      },
    });
  }

  let value = getPortalData(access.section);
  if (!value) return failure("Resource not found.", "NOT_FOUND", 404);
  if (
    access.session.role === "recruiter" &&
    ["applications", "candidates", "jobs", "interviews"].includes(access.section) &&
    Array.isArray(value)
  ) {
    value = value.filter((record) => record.company === RECRUITER_COMPANY);
  }
  const search = url.searchParams.get("search")?.toLocaleLowerCase();
  const records = Array.isArray(value)
    ? search
      ? value.filter((record) => Object.values(record).some((field) => String(field).toLocaleLowerCase().includes(search)))
      : value
    : value;

  const safeRecords = access.section === "documents" && Array.isArray(records)
    ? records.map((record) => Object.fromEntries(Object.entries(record).filter(([key]) => key !== "contentBase64")))
    : records;
  return NextResponse.json({ success: true, message: "Portal data loaded.", data: safeRecords });
}

export async function POST(request: Request, context: RouteContext) {
  const access = await authorize(request, context);
  if ("error" in access) return access.error;
  if (!canMutate(access.section, access.session.role, "POST")) {
    return failure("You do not have permission to create this resource.", "FORBIDDEN", 403);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return failure("Request body must be valid JSON.", "VALIDATION_ERROR", 400);
  }

  if (access.section === "documents") {
    const { name, contentBase64, size, contentType } = body;
    if (
      typeof name !== "string" ||
      typeof contentBase64 !== "string" ||
      contentType !== "application/pdf" ||
      typeof size !== "number" ||
      size <= 0 ||
      size > 2 * 1024 * 1024 ||
      contentBase64.length > 2_800_000
    ) {
      return failure("Choose a PDF file smaller than 2 MB.", "VALIDATION_ERROR", 400);
    }
    const bytes = Buffer.from(contentBase64, "base64");
    if (bytes.length !== size || bytes.subarray(0, 4).toString() !== "%PDF") {
      return failure("The uploaded file is not a valid PDF.", "VALIDATION_ERROR", 400);
    }
    const created = createPortalRecord(access.section, {
      name: name.replace(/[\r\n]/g, "").slice(0, 120),
      size,
      uploadedAt: new Date().toISOString(),
      contentBase64,
    });
    if (!created) return failure("Unable to save the document.", "RESOURCE_ERROR", 500);
    return NextResponse.json({ success: true, message: "Resume uploaded.", data: created }, { status: 201 });
  }

  const record = validateRecord(body);
  if (!record) return failure("Provide valid field values.", "VALIDATION_ERROR", 400);

  if (access.section === "applications" && access.session.role === "student") {
    const opportunityId = typeof body.opportunityId === "string" ? body.opportunityId : "";
    const application = updatePortalRecord(access.section, opportunityId, { status: "Applied" });
    if (!application) return failure("This opportunity is no longer available.", "NOT_FOUND", 404);
    return NextResponse.json({ success: true, message: "Application submitted.", data: application });
  }

  if (access.session.role === "recruiter") {
    if (typeof record.company === "string" && record.company !== RECRUITER_COMPANY) {
      return failure("Recruiters can only manage records for their authorized company.", "FORBIDDEN", 403);
    }
    if (["candidates", "jobs", "interviews", "applications"].includes(access.section)) {
      record.company = RECRUITER_COMPANY;
    }
  }
  const created = createPortalRecord(access.section, record);
  if (!created) return failure("This resource cannot be created.", "METHOD_NOT_ALLOWED", 405);
  return NextResponse.json({ success: true, message: "Record created.", data: created }, { status: 201 });
}

export async function PATCH(request: Request, context: RouteContext) {
  const access = await authorize(request, context);
  if ("error" in access) return access.error;
  if (!canMutate(access.section, access.session.role, "PATCH")) {
    return failure("You do not have permission to update this resource.", "FORBIDDEN", 403);
  }

  let body: { id?: unknown; updates?: unknown };
  try {
    body = await request.json() as { id?: unknown; updates?: unknown };
  } catch {
    return failure("Request body must be valid JSON.", "VALIDATION_ERROR", 400);
  }
  const updates = validateRecord(body.updates);
  if (!updates) return failure("Provide valid field values.", "VALIDATION_ERROR", 400);
  const id = typeof body.id === "string" ? body.id : undefined;
  if (Array.isArray(getPortalData(access.section)) && !id) {
    return failure("A record ID is required.", "VALIDATION_ERROR", 400);
  }
  if (access.session.role === "recruiter" && (!id || !belongsToRecruiter(access.section, id))) {
    return failure("This record is outside your company's authorized scope.", "FORBIDDEN", 403);
  }
  if (access.session.role === "recruiter" && typeof updates.company === "string" && updates.company !== RECRUITER_COMPANY) {
    return failure("Recruiters cannot move records to another company.", "FORBIDDEN", 403);
  }
  const updated = updatePortalRecord(access.section, id, updates);
  if (!updated) return failure("Record not found.", "NOT_FOUND", 404);
  return NextResponse.json({ success: true, message: "Changes saved.", data: updated });
}

export async function DELETE(request: Request, context: RouteContext) {
  const access = await authorize(request, context);
  if ("error" in access) return access.error;
  if (!canMutate(access.section, access.session.role, "DELETE")) {
    return failure("You do not have permission to delete this resource.", "FORBIDDEN", 403);
  }
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return failure("A record ID is required.", "VALIDATION_ERROR", 400);
  if (access.session.role === "recruiter" && !belongsToRecruiter(access.section, id)) {
    return failure("This record is outside your company's authorized scope.", "FORBIDDEN", 403);
  }
  if (!deletePortalRecord(access.section, id)) return failure("Record not found.", "NOT_FOUND", 404);
  return NextResponse.json({ success: true, message: "Record deleted.", data: { id } });
}
