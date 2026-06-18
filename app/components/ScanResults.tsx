'use client'

interface Feedback {
  score: number
  summary: string
  strengths: string[]
  gaps: string[]
  suggestions: string[]
}

interface Props {
  feedback: Feedback
}

const scoreTone = (score: number) => {
  if (score >= 70) return 'text-emerald-600 bg-emerald-50 border-emerald-100'
  if (score >= 40) return 'text-amber-600 bg-amber-50 border-amber-100'
  return 'text-red-600 bg-red-50 border-red-100'
}

export default function ScanResults({ feedback }: Props) {
  const panels = [
    {
      title: 'Strengths',
      items: feedback.strengths,
      className: 'border-emerald-100 bg-emerald-50/70 text-emerald-700',
    },
    {
      title: 'Gaps',
      items: feedback.gaps,
      className: 'border-amber-100 bg-amber-50/70 text-amber-700',
    },
    {
      title: 'Suggestions',
      items: feedback.suggestions,
      className: 'border-indigo-100 bg-indigo-50/80 text-indigo-700',
    },
  ]

  return (
    <section className="mt-8 space-y-5">
      <div className="rounded-lg border border-indigo-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className={`flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-lg border ${scoreTone(feedback.score)}`}>
            <span className="text-4xl font-black leading-none">{feedback.score}</span>
            <span className="mt-1 text-xs font-bold uppercase tracking-wide">Score</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Match report</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{feedback.summary}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {panels.map((panel) => (
          <div key={panel.title} className={`rounded-lg border p-5 ${panel.className}`}>
            <h3 className="text-sm font-bold uppercase tracking-wide">{panel.title}</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              {panel.items.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
