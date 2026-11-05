import { NextResponse } from "next/server";

import { getSessionFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  const session = getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ success: false, message: "Authentication required.", error: { code: "UNAUTHENTICATED" } }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    message: "Notifications fetched successfully.",
    data: {
      items: [
        { title: "Resume reviewed", detail: "Your resume for Apex Systems has been shortlisted for the technical panel.", time: "2h ago", tone: "success" },
        { title: "Drive update", detail: "Nexa Cloud hiring drive is scheduled for Tuesday, 10:00 AM.", time: "5h ago", tone: "neutral" },
        { title: "Profile alert", detail: "Academic verification pending for active backlog record.", time: "1d ago", tone: "warning" },
      ],
    },
  });
}
