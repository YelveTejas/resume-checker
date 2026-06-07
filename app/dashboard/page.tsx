'use client'


import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import ResumeUpload from '../components/ResumeUpload'
import { useState ,useEffect} from 'react'


export default  function DashboardPage() {
    const {data : session,status} = useSession()
    const router = useRouter()
    const [resumeText,setResumeText] = useState<string | null>(null)
    
  useEffect(()=>{
   if(status === 'unauthenticated'){
    router.replace('/login')
   }
  },[status,router])

  if(status == 'loading')   return <p>Loading...</p>



  return (
    <div style={{ padding: '40px' }}>
      <h1>Welcome,{session?.user.name}!</h1>
     <p style={{ color: '#888', marginBottom: '32px' }}>
        Upload your resume to get started
      </p>
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
    </div>
  )
}