'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

const links = [
  { href: '/dashboard', label: 'New Scan' },
  { href: '/history', label: 'History' },
]

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  if (!session || pathname === '/login') return null

  return (
    <header className="sticky top-0 z-30 border-b border-indigo-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-700 text-sm font-black text-white">
            R
          </span>
          <span className="text-base font-semibold tracking-tight text-slate-950">ResumeAI</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="flex rounded-lg bg-indigo-50 p-1">
            {links.map((link) => {
              const active = pathname === link.href

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-indigo-700'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden items-center gap-3 border-l border-indigo-100 pl-4 sm:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              {session.user?.name?.charAt(0) ?? 'U'}
            </span>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="rounded-lg border border-indigo-100 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
