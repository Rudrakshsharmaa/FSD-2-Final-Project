import { NextResponse } from "next/server";

import { getSessionFromRequest } from "@/lib/auth";
import { demoUsers } from "@/lib/mock-data";

export async function GET(request: Request) {
  const session = getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ success: false, message: "Authentication required.", error: { code: "UNAUTHENTICATED" } }, { status: 401 });
  }

  if (!["admin", "super_admin"].includes(session.role)) {
    return NextResponse.json({ success: false, message: "Access denied: insufficient permissions.", error: { code: "FORBIDDEN" } }, { status: 403 });
  }

  const students = demoUsers
    .filter((user) => user.role === "student")
    .map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      department: "Computer Science & Engineering",
      cgpa: "8.9",
      status: "Eligible",
    }));

  return NextResponse.json({
    success: true,
    message: "Student records fetched successfully.",
    data: students,
  });
}
