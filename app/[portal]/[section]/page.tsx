import { Suspense } from "react";
import { notFound } from "next/navigation";

import { PortalResourcePage } from "@/components/portal-resource-page";
import { allPortalRoles, portalSections } from "@/lib/portal-routes";
import type { Role } from "@/lib/types";

export function generateStaticParams() {
  return allPortalRoles.flatMap((portal) =>
    portalSections[portal]
      .filter((section) => section.slug)
      .map((section) => ({ portal: portal === "super_admin" ? "super-admin" : portal, section: section.slug })),
  );
}

export default function PortalSectionPage({
  params,
}: {
  params: Promise<{ portal: string; section: string }>;
}) {
  return (
    <Suspense fallback={<PortalSectionLoading />}>
      <PortalSectionContent params={params} />
    </Suspense>
  );
}

async function PortalSectionContent({
  params,
}: {
  params: Promise<{ portal: string; section: string }>;
}) {
  const { portal: pathRole, section } = await params;
  const roleValue = pathRole === "super-admin" ? "super_admin" : pathRole;
  if (!allPortalRoles.includes(roleValue as Role)) notFound();
  const role = roleValue as Role;
  if (!portalSections[role].some((item) => item.slug === section)) notFound();
  return <PortalResourcePage role={role} section={section} />;
}

function PortalSectionLoading() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl animate-pulse px-6 py-8 lg:px-12" aria-label="Loading portal page">
      <div className="h-4 w-36 rounded bg-slate-200" />
      <div className="mt-5 h-9 w-64 rounded bg-slate-200" />
      <div className="mt-3 h-4 w-96 max-w-full rounded bg-slate-200" />
      <div className="mt-8 h-14 rounded-xl bg-slate-200" />
      <div className="mt-5 h-72 rounded-2xl bg-slate-200" />
    </main>
  );
}
