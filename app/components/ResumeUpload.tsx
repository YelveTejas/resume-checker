'use client'

import { useState } from "react"

interface Props {
  onTextExtracted: (text: string) => void
}

export default function ResumeUpload({ onTextExtracted }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFile = async (file: File) => {
    setError(null)
    setFileName(file.name)
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('resume', file)
      const res = await fetch('/api/upload', {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to extract text")
        return
      }

      onTextExtracted(data.text)
    } catch {
      setError('Something went wrong, please try again')
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    setError(null)

    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`rounded-lg border-2 border-dashed p-8 text-center transition ${
        isDragging
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-indigo-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/60'
      }`}
    >
      <input
        type="file"
        accept=".pdf"
        onChange={handleInputChange}
        className="hidden"
        id="resume-input"
      />
      <label htmlFor="resume-input" className="block cursor-pointer">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-sm font-black text-indigo-700">
          PDF
        </span>
        {loading ? (
          <p className="text-sm font-semibold text-indigo-700">Extracting text from PDF...</p>
        ) : fileName ? (
          <div>
            <p className="text-sm font-semibold text-slate-900">{fileName}</p>
            <p className="mt-1 text-sm text-indigo-700">Click to choose a different file</p>
          </div>
        ) : (
          <div>
            <p className="text-base font-semibold text-slate-950">Drag and drop your resume here</p>
            <p className="mt-2 text-sm text-slate-500">or click to browse. PDF only, max 2MB.</p>
          </div>
        )}
      </label>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}
