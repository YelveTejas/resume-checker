'use client'

import { signIn } from 'next-auth/react'

export default function LoginPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <button
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer' }}
      >
        Sign in with Google
      </button>
    </div>
  )
}