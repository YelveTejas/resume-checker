'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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
  const { data: session, status } = useSession()
  const router = useRouter()

  const [scans, setScans] = useState<Scan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedScan, setSelectedScan] = useState<Scan | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchScans()
    }
  }, [status])

  const fetchScans = async () => {
    try {
      const res = await fetch('/api/scan-history')
      const data = await res.json()
      setScans(data.scans)
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (deletedId: string) => {
    // Remove from UI instantly without refetching
    setScans((prev) => prev.filter((s) => s.id !== deletedId))
    if (selectedScan?.id === deletedId) {
      setSelectedScan(null)
    }
  }

  if (status === 'loading' || loading) {
    return <p style={{ padding: '40px' }}>Loading...</p>
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <div>
          <h1 style={{ margin: '0 0 4px' }}>Scan History</h1>
          <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>
            {scans.length} scan{scans.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            padding: '10px 20px',
            background: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          + New Scan
        </button>
      </div>

      {/* Empty state */}
      {scans.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#fafafa',
          borderRadius: '12px',
          border: '1px dashed #ddd',
        }}>
          <p style={{ fontSize: '32px', margin: '0 0 12px' }}>📄</p>
          <p style={{ fontWeight: 500, margin: '0 0 8px' }}>No scans yet</p>
          <p style={{ color: '#888', fontSize: '14px', margin: '0 0 20px' }}>
            Upload your resume to get your first match score
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '10px 24px',
              background: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Start scanning
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {scans.map((scan) => (
            <ScanCard
              key={scan.id}
              scan={scan}
              onDelete={handleDelete}
              onClick={(scan) => setSelectedScan(scan)}
            />
          ))}
        </div>
      )}

      {/* Selected scan detail */}
      {selectedScan && (
        <div style={{ marginTop: '32px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            <h2 style={{ margin: 0 }}>Scan Details</h2>
            <button
              onClick={() => setSelectedScan(null)}
              style={{
                background: 'none',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              Close
            </button>
          </div>
          <ScanResults feedback={selectedScan.feedback} />
        </div>
      )}
    </div>
  )
}