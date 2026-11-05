import { NextResponse } from "next/server";

import { getSessionFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  const session = getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ success: false, message: "Authentication required.", error: { code: "UNAUTHENTICATED" } }, { status: 401 });
  }

  if (!["admin", "super_admin", "recruiter"].includes(session.role)) {
    return NextResponse.json({ success: false, message: "Access denied: insufficient permissions.", error: { code: "FORBIDDEN" } }, { status: 403 });
  }

  return NextResponse.json({
    success: true,
    message: "Analytics overview fetched successfully.",
    data: {
      overview: [
        { label: "Eligible Students", value: "1,842", delta: "+8.4%", tone: "positive" },
        { label: "Open Opportunities", value: "142", delta: "+14", tone: "neutral" },
        { label: "Drive Success", value: "81%", delta: "+5.6%", tone: "positive" },
        { label: "Pending Verifications", value: "37", delta: "-9", tone: "warning" },
      ],
      companies: [
        { name: "Apex Systems", value: 92, delta: "+18%" },
        { name: "Nexa Cloud", value: 87, delta: "+12%" },
        { name: "ByteForge", value: 74, delta: "+9%" },
      ],
      departments: [
        { name: "CSE", value: 40 },
        { name: "ECE", value: 27 },
        { name: "ME", value: 19 },
      ],
    },
  });
}
