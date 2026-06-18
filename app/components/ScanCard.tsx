'use client'

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

interface Props {
  scan: Scan
  onDelete: (id: string) => void
  onClick: (scan: Scan) => void
}

export default function ScanCard({ scan, onDelete, onClick }: Props) {
  const scoreClass =
    scan.score >= 70
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : scan.score >= 40
        ? 'border-amber-200 bg-amber-50 text-amber-700'
        : 'border-red-200 bg-red-50 text-red-700'

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()

    const confirmed = window.confirm('Are you sure you want to delete this scan?')
    if (!confirmed) return

    try {
      const res = await fetch('/api/scan-history', {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanId: scan.id }),
      })

      if (res.ok) {
        onDelete(scan.id)
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const jobPreview = scan.jobDescription.length > 120
    ? `${scan.jobDescription.slice(0, 120)}...`
    : scan.jobDescription
  const date = new Date(scan.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(scan)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick(scan)
      }}
      className="flex w-full flex-col gap-4 rounded-lg border border-indigo-100 bg-white p-4 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md sm:flex-row sm:items-center"
    >
      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border text-base font-black ${scoreClass}`}>
        {scan.score}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-slate-950">{jobPreview}</span>
        <span className="mt-1 block text-xs font-medium text-slate-500">{date}</span>
      </span>

      <button
        type="button"
        onClick={handleDelete}
        className="inline-flex shrink-0 items-center justify-center rounded-lg border border-red-100 px-3 py-2 text-sm font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50"
      >
        Delete
      </button>
    </div>
  )
}
