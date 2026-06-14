'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session) return null

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 32px',
      borderBottom: '1px solid #eee',
      background: '#fff',
    }}>
      {/* Logo */}
      <span
        onClick={() => router.push('/dashboard')}
        style={{
          fontWeight: 700,
          fontSize: '16px',
          cursor: 'pointer',
          color: '#6366f1',
        }}
      >
        ResumeAI
      </span>

      {/* Links */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <span
          onClick={() => router.push('/dashboard')}
          style={{ fontSize: '14px', cursor: 'pointer', color: '#444' }}
        >
          New Scan
        </span>
        <span
          onClick={() => router.push('/history')}
          style={{ fontSize: '14px', cursor: 'pointer', color: '#444' }}
        >
          History
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={session.user.image ?? ''}
            alt="profile"
            width={28}
            height={28}
            style={{ borderRadius: '50%' }}
          />
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{
              background: 'none',
              border: '1px solid #eee',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '13px',
              cursor: 'pointer',
              color: '#666',
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}