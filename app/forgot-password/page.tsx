"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.get("email") }),
      });
      const payload = await response.json() as { message?: string };
      setMessage(payload.message ?? "Unable to process this request.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to process this request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F6F2] px-6 py-12 text-[#111827]">
      <section className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_20px_50px_rgba(17,24,39,0.07)]">
        <div className="mb-8 flex justify-end"><ThemeToggle /></div>
        <p className="text-xs uppercase tracking-[0.18em] text-[#4263EB]">Account recovery</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">Forgot your password?</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Enter your registered email to check password recovery availability.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">Registered email</label>
          <input id="email" name="email" type="email" required autoComplete="email" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-[#4263EB]" placeholder="name@university.edu" />
          {message && <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{message}</p>}
          <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-[#111827] px-4 py-3 text-sm font-medium text-white disabled:opacity-60">
            {isSubmitting ? "Checking..." : "Continue"}
          </button>
        </form>
        <Link href="/login" className="mt-5 inline-block text-sm font-medium text-[#4263EB] hover:underline">Back to sign in</Link>
      </section>
    </main>
  );
}
