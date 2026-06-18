'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import ScanCard from '../components/ScanCard'
import ScanResults from '../components/ScanResults'

interface Feedback {
  score: number
  summary: string
  strengths: string[]
  gaps: string[]
  suggestions: string[]
}

interface Scan {
  id: string
  score: number
  jobDescription: string
  createdAt: string
  feedback: Feedback
}

export default function HistoryPage() {
  const { status } = useSession()
  const router = useRouter()

  const [scans, setScans] = useState<Scan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedScan, setSelectedScan] = useState<Scan | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [router, status])

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchScans = async () => {
        try {
          const res = await fetch('/api/scan-history')
          const data = await res.json()
          setScans(data.scans ?? [])
        } catch (error) {
          console.error('Fetch error:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchScans()
    }
  }, [status])

  const handleDelete = (deletedId: string) => {
    setScans((prev) => prev.filter((s) => s.id !== deletedId))
    if (selectedScan?.id === deletedId) {
      setSelectedScan(null)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-indigo-50/40 px-4">
        <div className="flex items-center gap-3 rounded-lg border border-indigo-100 bg-white px-5 py-4 text-sm font-semibold text-indigo-700 shadow-sm">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-700" />
          Loading scan history...
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-indigo-50/40 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="mb-6 flex flex-col gap-4 rounded-lg border border-indigo-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Scan history</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">Previous resume reports</h1>
            <p className="mt-2 text-sm text-slate-500">
              {scans.length} scan{scans.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="rounded-lg bg-indigo-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-800"
          >
            New scan
          </button>
        </section>

        {scans.length === 0 ? (
          <section className="rounded-lg border border-dashed border-indigo-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-indigo-100 text-base font-black text-indigo-700">
              R
            </div>
            <h2 className="text-lg font-semibold text-slate-950">No scans yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Run your first resume analysis and your reports will appear here.
            </p>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="mt-6 rounded-lg bg-indigo-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-800"
            >
              Start scanning
            </button>
          </section>
        ) : (
          <section className="space-y-3">
            {scans.map((scan) => (
              <ScanCard
                key={scan.id}
                scan={scan}
                onDelete={handleDelete}
                onClick={(scan) => setSelectedScan(scan)}
              />
            ))}
          </section>
        )}

        {selectedScan && (
          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-950">Scan details</h2>
              <button
                type="button"
                onClick={() => setSelectedScan(null)}
                className="rounded-lg border border-indigo-100 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
              >
                Close
              </button>
            </div>
            <ScanResults feedback={selectedScan.feedback} />
          </section>
        )}
      </div>
    </main>
  )
}
