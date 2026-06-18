'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import ResumeUpload from '../components/ResumeUpload'
import ScanResults from '../components/ScanResults'

interface Feedback {
  score: number
  summary: string
  strengths: string[]
  gaps: string[]
  suggestions: string[]
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [resumeText, setResumeText] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [router, status])

  const handleScan = async () => {
    if (!resumeText) {
      setError('Please upload your resume first.')
      return
    }

    if (jobDescription.trim().length < 50) {
      setError('Please enter a job description with at least 50 characters.')
      return
    }

    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Unable to analyse this resume.')
        return
      }

      setFeedback(data.feedback)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-indigo-50/40 px-4">
        <div className="flex items-center gap-3 rounded-lg border border-indigo-100 bg-white px-5 py-4 text-sm font-semibold text-indigo-700 shadow-sm">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-700" />
          Loading your workspace...
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-indigo-50/40 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8 rounded-lg bg-indigo-700 px-6 py-7 text-white shadow-sm sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-100">
                Resume dashboard
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Welcome, {session?.user?.name ?? 'there'}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100 sm:text-base">
                Upload your resume, paste a job description, and get a clean match report with the next changes to make.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/history')}
              className="w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50 sm:w-auto"
            >
              View history
            </button>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-lg border border-indigo-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Step 1</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950">Upload resume</h2>
              </div>
              {resumeText && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  Text ready
                </span>
              )}
            </div>

            <ResumeUpload onTextExtracted={(text) => setResumeText(text)} />

            {resumeText && (
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-950">Extracted text</h3>
                  <span className="text-xs font-medium text-slate-500">{resumeText.length} characters</span>
                </div>
                <textarea
                  value={resumeText}
                  readOnly
                  rows={9}
                  className="w-full resize-y rounded-lg border border-indigo-100 bg-slate-50 p-3 font-mono text-xs leading-5 text-slate-600 outline-none"
                />
              </div>
            )}
          </div>

          <div className="rounded-lg border border-indigo-100 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Step 2</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">Paste job description</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Include responsibilities, required skills, and experience expectations for the best report.
            </p>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={15}
              className="mt-5 w-full resize-y rounded-lg border border-indigo-100 bg-white p-4 text-sm leading-6 text-slate-800 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />

            {error && (
              <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleScan}
              disabled={loading}
              className="mt-5 flex h-12 w-full items-center justify-center rounded-lg bg-indigo-700 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-indigo-300"
            >
              {loading ? 'Analysing your resume...' : 'Analyse resume'}
            </button>
          </div>
        </section>

        {feedback && <ScanResults feedback={feedback} />}
      </div>
    </main>
  )
}
