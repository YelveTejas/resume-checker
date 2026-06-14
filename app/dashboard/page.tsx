'use client'


import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import ResumeUpload from '../components/ResumeUpload'
import { useState ,useEffect} from 'react'
import ScanResults from '../components/ScanResults'


interface Feedback {
  score: number
  summary: string
  strengths: string[]
  gaps: string[]
  suggestions: string[]
}

export default  function DashboardPage() {
    const {data : session,status} = useSession()
    const router = useRouter()
    const [jobDescription,setJobDescription] = useState('')
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState<string | null>(null)
    const [feedback,setFeedback] = useState<Feedback | null>(null)
    const [resumeText,setResumeText] = useState<string | null>(null)
    
  useEffect(()=>{
   if(status === 'unauthenticated'){
    router.replace('/login')
   }
  },[status,router])

  if(status == 'loading')   return <p>Loading...</p>

  const handleScan =  async ()=>{
    if(!resumeText){
      setError('Please upload your resume first')
      return
    }

    if(jobDescription.trim().length< 50){
      setError('Please enter a job description (min 50 characters)')
      return
    }

    setError(null)
    setLoading(true)

    try{
    const res = await fetch('/api/scan',{
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText, jobDescription }),
    })

    const data = await res.json()
    if(!res.ok){
      setError(data.error)
      return
    }
    console.log(data,'data')
     setFeedback(data.feedback)
    }catch(error){
     setError('Something went wrong. Please try again.')
    }
    finally{
       setLoading(false)
    }
  }

  return (
    <div style={{ padding: '40px' }}>
      <h1>Welcome,{session?.user.name}!</h1>
     <p style={{ color: '#888', marginBottom: '32px' }}>
       Upload your resume and paste a job description to get your match score
      </p>
       <h2 style={{ fontSize: '16px', marginBottom: '12px' }}>
        Step 1 — Upload Resume
      </h2>
       <ResumeUpload onTextExtracted={(text) => setResumeText(text)} />
        {resumeText && (
        <div style={{ marginTop: '24px' }}>
          <h3>✅ Text extracted successfully</h3>
          <textarea
            value={resumeText}
            readOnly
            rows={10}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '13px',
              fontFamily: 'monospace',
              resize: 'vertical',
            }}
          />
          <p style={{ color: '#888', fontSize: '13px' }}>
            {resumeText.length} characters extracted
          </p>
        </div>
       
      )}
      <h2 style={{ fontSize: '16px', margin: '32px 0 12px' }}>
        Step 2 — Paste Job Description
      </h2>
       <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste the full job description here..."
        rows={8}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #ddd',
          fontSize: '13px',
          resize: 'vertical',
          boxSizing: 'border-box',
        }}
      />
       {error && (
        <p style={{ color: 'red', fontSize: '13px', marginTop: '8px' }}>
          ❌ {error}
        </p>
      )}
       <button
        onClick={handleScan}
        disabled={loading}
        style={{
          marginTop: '16px',
          padding: '12px 32px',
          background: loading ? '#ccc' : '#6366f1',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '15px',
          fontWeight: 500,
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%',
        }}
      >
        {loading ? 'Analysing your resume...' : '🔍 Analyse Resume'}
      </button>

      {/* Results */}
      {feedback && <ScanResults feedback={feedback} />}

    </div>
  )
}