import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: { email?: unknown };
  try {
    body = await request.json() as { email?: unknown };
  } catch {
    return NextResponse.json(
      { success: false, message: "Request body must be valid JSON.", error: { code: "VALIDATION_ERROR" } },
      { status: 400 },
    );
  }

  if (typeof body.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
    return NextResponse.json(
      { success: false, message: "Enter a valid email address.", error: { code: "VALIDATION_ERROR" } },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: "Password recovery email is not configured yet. Contact your platform administrator to reset your account.",
      error: { code: "EMAIL_DELIVERY_NOT_CONFIGURED" },
    },
    { status: 503 },
  );
}
