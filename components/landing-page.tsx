"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  CircleDashed,
  FileText,
  GraduationCap,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartData = [
  { month: "Jan", demo: 25 },
  { month: "Feb", demo: 35 },
  { month: "Mar", demo: 42 },
  { month: "Apr", demo: 48 },
  { month: "May", demo: 60 },
  { month: "Jun", demo: 72 },
  { month: "Jul", demo: 86 },
];

const featureCards = [
  { title: "Career pipeline", description: "Track opportunities, stages, and application health in one workspace.", icon: BriefcaseBusiness },
  { title: "Verified eligibility", description: "Keep academic records aligned with placement rules and admin approval workflows.", icon: ShieldCheck },
  { title: "Smart recruiting", description: "Surface talent, shortlist faster, and orchestrate placement drives effectively.", icon: TrendingUp },
  { title: "Real-time visibility", description: "Give students and recruiters timely updates without chasing manual status checks.", icon: CircleDashed },
];

const featuredCompanies = ["Microsoft", "Google", "Amazon", "Flipkart", "Infosys", "Jio", "Cognizant", "Oracle"];

const steps = [
  "Students publish profiles and resumes.",
  "Placement teams verify eligibility and drive rules.",
  "Recruiters discover top-fit candidates and arrange interviews.",
];

const portalHighlights = [
  {
    title: "Student Portal",
    copy: "Monitor eligibility, explore verified opportunities, manage resumes, and follow recruiter updates in real time.",
  },
  {
    title: "Placement Cell / Administrator Portal",
    copy: "Control company approvals, student verification, hiring health, and placement performance from one command center.",
  },
  {
    title: "Company / Recruiter Portal",
    copy: "Access curated student pools, review shortlists, coordinate interviews, and manage hiring pipelines with precision.",
  },
];

const faqs = [
  {
    question: "How does CampusPulse support three distinct user groups?",
    answer: "Each role has dedicated permissions, dashboards, and workflows for students, administrators, and recruiters.",
  },
  {
    question: "Can the platform work with existing university systems?",
    answer: "The interface is designed for easy extension into Supabase-authenticated admissions and recruitment data sources.",
  },
  {
    question: "What makes the experience premium?",
    answer: "Editorial typography, structured composition, meaningful motion, and attention to operational clarity set the product apart.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#111827]">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-[#F7F6F2]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111827] text-sm font-semibold text-[#F7F6F2]">
              CP
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">CampusPulse</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <Link href="#platform">Platform</Link>
            <Link href="#opportunities">Opportunities</Link>
            <Link href="#portals">Portals</Link>
            <Link href="#faq">FAQ</Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-500 hover:text-slate-900">
              Access Your Portal
            </Link>
            <Link href="#opportunities" className="rounded-full bg-[#4263EB] px-4 py-2 text-sm font-medium text-white shadow-[0_10px_30px_rgba(66,99,235,0.25)] transition hover:bg-[#3650c5]">
              Explore Opportunities
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(66,99,235,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(185,230,211,0.28),_transparent_22%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#111827]/10 bg-white/70 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-slate-700">
                <Sparkles className="h-3.5 w-3.5 text-[#4263EB]" />
                Campus intelligence for hiring teams
              </div>
              <h1 className="max-w-xl text-5xl font-semibold tracking-[-0.08em] text-[#111827] sm:text-6xl">
                Your career doesn&apos;t wait. Neither should your campus.
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
                One connected platform for students, recruiters and placement teams. Discover opportunities, manage recruitment and turn campus potential into careers.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="#opportunities" className="inline-flex items-center gap-2 rounded-full bg-[#111827] px-6 py-3 text-sm font-medium text-[#F7F6F2] transition hover:bg-[#1d2942]">
                  Explore Opportunities <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white">
                  Access Your Portal <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-[#4263EB]" /> 180+ active employers</div>
                <div className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-[#16845B]" /> 12k+ student profiles</div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="relative">
              <div className="rounded-[28px] border border-slate-200 bg-white/80 p-4 shadow-[0_30px_80px_rgba(17,24,39,0.10)]">
                <div className="mb-4 flex items-center justify-between rounded-2xl bg-[#111827] px-4 py-3 text-[#F7F6F2]">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-300">Illustrative placement pulse</p>
                    <p className="mt-1 text-xl font-semibold">2025 hiring momentum</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-[#B9E6D3]" />
                </div>

                <div className="h-56 w-full rounded-2xl bg-[#F7F6F2] p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="fillColor" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="5%" stopColor="#4263EB" stopOpacity={0.45} />
                          <stop offset="95%" stopColor="#4263EB" stopOpacity={0.06} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#dfe4ea" />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="demo" stroke="#4263EB" fill="url(#fillColor)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Offers</p>
                    <p className="mt-2 text-2xl font-semibold text-[#111827]">428</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Drives</p>
                    <p className="mt-2 text-2xl font-semibold text-[#111827]">36</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Success</p>
                    <p className="mt-2 text-2xl font-semibold text-[#16845B]">83%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="platform" className="mx-auto max-w-7xl px-6 py-20 lg:px-12">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-[#4263EB]">Platform features</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#111827]">Built for high-velocity hiring operations.</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map(({ title, description, icon: Icon }) => (
              <motion.div key={title} whileHover={{ y: -4 }} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#B9E6D3] text-[#111827]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-[#111827]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="opportunities" className="bg-[#111827] py-20 text-[#F7F6F2]">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#B9E6D3]">Featured recruiting</p>
                <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em]">Upcoming placement drives</h2>
              </div>
              <Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-slate-500 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-300 hover:text-white">
                View all roles <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {[
                { name: "Apex Systems", role: "Software Engineer I", tag: "Bengaluru • 18.5 LPA" },
                { name: "Nexa Cloud", role: "Frontend Engineer", tag: "Hyderabad • 22.0 LPA" },
                { name: "ByteForge", role: "Data Engineer", tag: "Pune • 15.8 LPA" },
              ].map((job) => (
                <div key={job.name} className="rounded-[24px] border border-slate-700 bg-[#181f2e] p-6">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#B9E6D3] px-2.5 py-1 text-xs font-medium text-[#111827]">Open</span>
                    <span className="text-xs text-slate-300">Illustrative role</span>
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-white">{job.role}</h3>
                  <p className="mt-2 text-slate-300">{job.name}</p>
                  <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-900/60 p-3 text-sm text-slate-200">{job.tag}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {featuredCompanies.map((company) => (
                <div key={company} className="rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm font-medium text-slate-200">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-12">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-[#4263EB]">Success stories</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#111827]">Students launch stronger careers.</h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {[
              { name: "Aisha R.", quote: "The platform made the hiring process transparent. I could track every shortlist and stay informed without missing deadlines." },
              { name: "Rohan K.", quote: "I used the resume manager and profile verification flow to present a polished profile to recruiters." },
              { name: "Sana M.", quote: "The recruiter communication and event updates felt simple, timely, and highly professional." },
            ].map((story) => (
              <div key={story.name} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2 text-[#D99B37]">
                  {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                </div>
                <p className="text-base leading-7 text-slate-700">“{story.quote}”</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B9E6D3] text-sm font-semibold text-[#111827]">{story.name.slice(0, 1)}</div>
                  <div>
                    <p className="font-medium text-[#111827]">{story.name}</p>
                    <p className="text-xs text-slate-500">Placement success story</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="portals" className="bg-[#F2F5F9] py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mb-12 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.18em] text-[#4263EB]">Three portals</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#111827]">Connected, permission-aware access for every stakeholder.</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {portalHighlights.map((portal) => (
                <div key={portal.title} className="rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8EEFF] text-[#4263EB]">
                    {portal.title.includes("Student") ? <GraduationCap className="h-5 w-5" /> : portal.title.includes("Recruiter") ? <MessageSquareText className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                  </div>
                  <h3 className="text-2xl font-semibold text-[#111827]">{portal.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{portal.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-12">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-[#4263EB]">How CampusPulse works</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#111827]">From interest to offer in a streamlined flow.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#111827] text-sm font-semibold text-[#F7F6F2]">{index + 1}</div>
                <p className="text-lg leading-8 text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="bg-[#111827] py-20 text-[#F7F6F2]">
          <div className="mx-auto max-w-5xl px-6 lg:px-12">
            <div className="mb-10 text-center">
              <p className="text-xs uppercase tracking-[0.18em] text-[#B9E6D3]">FAQ</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-white">Common questions.</h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-[22px] border border-slate-700 bg-[#181f2e] p-6">
                  <h3 className="text-lg font-medium text-white">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-[#F7F6F2]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-4 lg:px-12">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#111827] text-sm font-semibold text-[#F7F6F2]">CP</div>
              <p className="text-lg font-semibold text-[#111827]">CampusPulse</p>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-600">The premium placement intelligence platform for modern universities and hiring teams.</p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Platform</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>Students</li>
              <li>Placement cell</li>
              <li>Recruiters</li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Resources</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>Opportunities</li>
              <li>Support</li>
              <li>Documentation</li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Contact</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>hello@campuspulse.io</li>
              <li>+91 80000 12345</li>
              <li>Support Center</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
