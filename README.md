# ResumeAI

ResumeAI is a Next.js app that helps users compare a PDF resume against a job description. Users sign in with Google, upload a resume, paste a job description, and receive an AI-generated match score with strengths, gaps, and suggestions.

## Features

- Google sign-in with NextAuth
- PDF resume upload and text extraction
- AI resume/job-description match analysis
- Match score, strengths, gaps, and suggestions
- Scan history saved per user
- Daily scan limit
- Indigo and white dashboard UI

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- NextAuth
- Prisma
- PostgreSQL
- Groq SDK

## Getting Started

Install dependencies:

```bash
npm install
```

Generate Prisma Client:

```bash
npm exec prisma generate
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Environment Variables

Create a `.env` file in the project root.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

OPENAI_API_KEY="your-groq-api-key"
```

Note: the app currently uses the Groq SDK in `lib/openai.ts`, but the code reads the key from `OPENAI_API_KEY`.

## Google OAuth Setup

In Google Cloud Console, create an OAuth 2.0 Client ID.

For local development, add this authorized redirect URI:

```text
http://localhost:3000/api/auth/callback/google
```

For Vercel deployment, add your production callback URL:

```text
https://your-vercel-domain.vercel.app/api/auth/callback/google
```

Example:

```text
https://resume-checker-snowy.vercel.app/api/auth/callback/google
```

Also set this in Vercel:

```env
NEXTAUTH_URL="https://your-vercel-domain.vercel.app"
```

## Database Setup

After setting `DATABASE_URL`, apply the Prisma schema:

```bash
npm exec prisma db push
```

Regenerate Prisma Client after schema changes:

```bash
npm exec prisma generate
```

## Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run build
```

Runs `prisma generate` and builds the Next.js app.

```bash
npm run start
```

Starts the production server after a build.

```bash
npm run lint
```

Runs ESLint.

## Vercel Deployment

This project needs Prisma Client generated during deployment. The `build` and `postinstall` scripts already handle that:

```json
"build": "prisma generate && next build",
"postinstall": "prisma generate"
```

Before deploying, add these environment variables in Vercel:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `OPENAI_API_KEY`

If Google sign-in fails with a redirect URI error, add the exact URI shown in the Google error message to the OAuth client's authorized redirect URIs.

## Important Security Notes

- Do not commit `.env` files.
- Rotate any API key or secret that has been shared publicly.
- Use a strong random value for `NEXTAUTH_SECRET`.

## Project Structure

```text
app/
  api/
    auth/[...nextauth]/
    scan/
    scan-history/
    upload/
  components/
  dashboard/
  history/
  login/
lib/
  auth.ts
  openai.ts
  prisma.ts
  prompts.ts
prisma/
  schema.prisma
```
