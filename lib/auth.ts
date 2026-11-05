import crypto from "node:crypto";

import type { Role } from "@/lib/types";

export type SessionPayload = {
  id: string;
  role: Role;
  email: string;
  name: string;
};

const SESSION_COOKIE_NAME = "campuspulse.session";
const DEFAULT_SECRET = "campuspulse-demo-secret";

function getSecret() {
  return process.env.CAMPUSPULSE_SESSION_SECRET ?? DEFAULT_SECRET;
}

export function signSession(payload: SessionPayload) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(`${header}.${body}`)
    .digest("base64url");

  return `${header}.${body}.${signature}`;
}

export function verifySession(token: string): SessionPayload | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [headerBase64, bodyBase64, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", getSecret())
    .update(`${headerBase64}.${bodyBase64}`)
    .digest("base64url");

  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    try {
      const payload = JSON.parse(Buffer.from(bodyBase64, "base64url").toString("utf8")) as SessionPayload;
      return payload;
    } catch {
      return null;
    }
  }

  return null;
}

export function readSessionCookie(cookieHeader: string | null) {
  if (!cookieHeader) return null;

  const cookie = cookieHeader
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${SESSION_COOKIE_NAME}=`));

  if (!cookie) return null;
  const rawValue = cookie.slice(SESSION_COOKIE_NAME.length + 1);
  return verifySession(decodeURIComponent(rawValue));
}

export function getSessionFromRequest(request: Request) {
  return readSessionCookie(request.headers.get("cookie"));
}

export function buildCookieOptions(rememberMe = false) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 8,
  };
}
