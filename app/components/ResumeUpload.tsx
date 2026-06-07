'use client'

import { useState } from "react"


interface Props{
    onTextExtracted:(text:string) => void
}

export default function ResumeUpload({onTextExtracted}:Props){
  const [isDragging,setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error,setError] = useState<string | null>(null)
  const [loading,setLoading] = useState(false)

  const handleFile =  async(file:File)=>{
    setError(null)
    setFileName(file.name)
    setLoading(true)
    try{
     const formData = new FormData()
     formData.append('resume',file)
     const res = await fetch('api/upload',{
        method:"POST",
        body:formData,
     })

     const data = await res.json()

     if(!res.ok){
        setError(data.error ||"Failed to extract text")
        return 
     }
     onTextExtracted(data.text)
     
    }catch(error){
     setError('Something went wrong, please try again')
    }
    finally{
        setLoading(false)
    }
  }


const handleDrop = (e:React.DragEvent)=>{
    e.preventDefault()
    setIsDragging(false)
    setError(null)
   
  const file = e.dataTransfer.files[0]
  if(file) handleFile(file)

}

const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0]
    if(file) handleFile(file)
}

return (
    <div 
     onDragOver={(e)=>{e.preventDefault(); setIsDragging(true)}}
     onDragLeave={()=>setIsDragging(false)}
     onDrop={handleDrop}
     style={{
      border: `2px dashed ${isDragging ? '#6366f1' : '#ccc'}`,
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        background: isDragging ? '#eef2ff' : '#fafafa',
        cursor: 'pointer',
        transition: 'all 0.2s',
     }}
    >
        <input
        type="file"
        accept=".pdf"
        onChange={handleInputChange}
        style={{ display: 'none' }}
        id="resume-input"
        >
        </input>
        <label htmlFor="resume-input" style={{cursor:'pointer'}}>
         {loading ? 
         (
           <p>Extracting text from PDF...</p>
         ): fileName ? (
          <>
           <p>✅ {fileName} — <span style={{ color: '#6366f1' }}>change file</span></p>
          </>
         ):(
            <>
             <p style={{ fontSize: '16px', fontWeight: 500 }}>
              Drag & drop your resume here
            </p>
            <p style={{ color: '#888', fontSize: '14px' }}>
              or click to browse — PDF only, max 2MB
            </p>
            </>
         )}
        </label>

        {
            error && (
                <p style={{ color: '#ef4444', marginTop: '16px' }}>
                  ❌ {error}
                </p>
            )
        }

    </div>
)

}