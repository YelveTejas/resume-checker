'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const benefits = [
  {
    title: 'Match scoring',
    copy: 'See how closely your resume aligns with each role.',
  },
  {
    title: 'Gap analysis',
    copy: 'Spot missing keywords, skills, and experience signals.',
  },
  {
    title: 'Clear next steps',
    copy: 'Turn the feedback into targeted resume edits.',
  },
]

export default function LoginPage() {
  const { status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard')
    }
  }, [router, status])

  const handleLogin = async () => {
    setLoading(true)
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <main className="min-h-[100svh] bg-white text-slate-950 lg:h-[100svh] lg:overflow-hidden">
      <div className="grid min-h-[100svh] lg:h-full lg:min-h-0 lg:grid-cols-2">
        <section className="relative min-h-[36rem] overflow-hidden bg-indigo-700 px-6 py-8 text-white sm:px-10 lg:h-full lg:min-h-0 lg:px-14">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0)_45%)]" />
          <div className="absolute right-[-120px] top-24 h-80 w-80 rounded-full border border-white/15" />
          <div className="absolute bottom-[-140px] left-[-120px] h-80 w-80 rounded-full bg-white/10" />

          <div className="relative mx-auto flex h-full max-w-2xl flex-col justify-center">
            <div className="mb-14 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-base font-black text-indigo-700 shadow-sm">
                R
              </div>
              <span className="text-lg font-semibold tracking-wide">ResumeAI</span>
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-100">
              AI resume checker
            </p>
            <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">
              Tune every resume for the role in front of you.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-indigo-100">
              Upload your resume, paste the job description, and get a focused match report before you apply.
            </p>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {benefits.map((benefit, index) => (
                <div key={benefit.title} className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-md bg-white text-sm font-bold text-indigo-700">
                    {index + 1}
                  </div>
                  <h2 className="text-sm font-semibold">{benefit.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-indigo-100">{benefit.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex min-h-[32rem] items-center justify-center bg-white px-6 py-10 sm:px-10 lg:h-full lg:min-h-0">
          <div className="w-full max-w-md rounded-lg border border-indigo-100 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Welcome back
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Sign in to continue
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Your dashboard keeps scan results and feedback history in one tidy workspace.
            </p>

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading || status === 'loading'}
              className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-indigo-100 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading || status === 'loading' ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-700" />
              ) : (
                <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              {loading || status === 'loading' ? 'Opening Google sign in...' : 'Continue with Google'}
            </button>

            <div className="my-7 flex items-center gap-3 text-xs font-medium text-slate-400">
              <div className="h-px flex-1 bg-slate-200" />
              No password required
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {['Secure login', 'Fast scans', 'Saved history'].map((item) => (
                <div key={item} className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-3 text-center text-xs font-semibold text-indigo-800">
                  {item}
                </div>
              ))}
            </div>

            <p className="mt-7 text-center text-xs leading-5 text-slate-500">
              ResumeAI uses your account only to keep your scan history connected to you.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
