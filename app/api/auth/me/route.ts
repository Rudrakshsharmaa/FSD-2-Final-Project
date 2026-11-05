import { NextResponse } from "next/server";

import { getSessionFromRequest } from "@/lib/auth";
import { demoUsers } from "@/lib/mock-data";

export async function GET(request: Request) {
  const session = getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Session expired or missing.", error: { code: "UNAUTHENTICATED" } },
      { status: 401 },
    );
  }

  const user = demoUsers.find((entry) => entry.id === session.id);

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Session user could not be resolved.", error: { code: "SESSION_INVALID" } },
      { status: 401 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Session restored.",
    data: {
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
    },
  });
}
