import { NextResponse } from "next/server";

import { buildCookieOptions, signSession } from "@/lib/auth";
import { demoUsers } from "@/lib/mock-data";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string; rememberMe?: boolean };
    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required.",
          error: { code: "VALIDATION_ERROR", details: { email: !!email, password: !!password } },
        },
        { status: 400 },
      );
    }

    const user = demoUsers.find((entry) => entry.email.toLowerCase() === email);
    if (!user || user.password !== password) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
          error: { code: "AUTH_INVALID_CREDENTIALS" },
        },
        { status: 401 },
      );
    }

    const sessionToken = signSession({
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      data: {
        user: {
          id: user.id,
          role: user.role,
          name: user.name,
          email: user.email,
        },
      },
    });

    response.cookies.set("campuspulse.session", sessionToken, buildCookieOptions(Boolean(body.rememberMe)));
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to authenticate user.",
        error: { code: "AUTH_FAILURE", details: { message: error instanceof Error ? error.message : "Unknown error" } },
      },
      { status: 500 },
    );
  }
}
