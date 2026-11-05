import type { ApiResponse, Role, StudentProfile, UserSession } from "@/lib/types";

const defaultHeaders = {
  "Content-Type": "application/json",
};

async function request<T>(path: string, init: RequestInit = {}): Promise<ApiResponse<T>> {
  const response = await fetch(path, {
    ...init,
    headers: {
      ...defaultHeaders,
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok) {
    const message = payload?.message ?? "Request failed";
    throw new Error(message);
  }

  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid response payload");
  }

  return payload;
}

export type LoginPayload = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export async function loginUser(payload: LoginPayload) {
  return request<"user" extends never ? never : { user: UserSession }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUser() {
  return request<{ user: UserSession }>("/api/auth/me");
}

export async function logoutUser() {
  return request<{ success: true }>("/api/auth/logout", {
    method: "POST",
  });
}

export async function getStudents() {
  return request<StudentProfile[]>("/api/students");
}

export async function getAnalyticsOverview() {
  return request<{
    overview: {
      label: string;
      value: string;
      delta: string;
      tone: "positive" | "neutral" | "warning";
    }[];
    companies: { name: string; value: number; delta: string }[];
    departments: { name: string; value: number }[];
  }>("/api/analytics/overview");
}

export async function getNotifications() {
  return request<{ items: { title: string; detail: string; time: string; tone: string }[] }>("/api/notifications");
}

export type RoleAccess = {
  role: Role;
  route: string;
};

export function getPortalRoute(role: Role) {
  const map: Record<Role, string> = {
    student: "/student",
    admin: "/admin",
    recruiter: "/recruiter",
    super_admin: "/super-admin",
  };

  return map[role];
}
