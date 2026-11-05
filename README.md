This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Portal pages and APIs

The portal navigation opens role-specific pages under `/student/*`, `/admin/*`,
`/recruiter/*`, and `/super-admin/*`. These pages use the authenticated
`/api/portal/[section]` API for listing, searching, and supported create/update/
delete actions. API access is checked against the signed session cookie and the
role allowed for each section. Recruiter records are scoped to the demo
recruiter's authorized company.

The portal includes a theme toggle on public and authenticated pages. The
selection is saved in browser local storage.

### Demo data and production setup

The API currently operates on seeded in-memory demo records. Changes are
available to the running server process, but are not durable across a server
restart and are not a substitute for a production database. No Supabase
credentials or persistent database schema are configured in this workspace.
Before production use, connect the API data layer to a configured database,
enable database-level row policies, and configure an email provider for account
recovery. The forgot-password page clearly reports that email delivery is not
configured rather than claiming that a reset email was sent.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
