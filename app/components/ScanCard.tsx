'use client'

interface Feedback {
    score: number
    summary:string 
    strengths:string[]
    gaps:string[]
    suggestions:string[]
}


interface Scan {
    id:string
    score:number 
    jobDescription:string 
    createdAt:string 
    feedback:Feedback
}


interface Props {
    scan:Scan 
    onDelete:(id:string) =>void
    onClick:(scan:Scan)=>void
}

export default function ScanCard({scan,onDelete,onClick}:Props){
    const scoreColor =
    scan.score >= 70 ? '#16a34a' :
    scan.score >= 40 ? '#d97706' : '#dc2626'

    const handleDelete = async (e:React.MouseEvent)=>{
         e.stopPropagation()

    const confirmed = window.confirm(
      'Are you sure you want to delete this scan?'
    )
    if (!confirmed) return

      try{
        const res = await fetch('/api/scan-history',{
            method:"DELETE",
            headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanId: scan.id }),
        })

        if(res.ok){
            onDelete(scan.id)
        }
      }catch(error){
       console.error('Delete error:', error)
      }
    }


    const jobPreview = scan.jobDescription.slice(0,100)+"..."
    const date = new Date(scan.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
return (
    <div
      onClick={() => onClick(scan)}
      style={{
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: '12px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#6366f1'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow =
          '0 2px 8px rgba(99,102,241,0.1)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#eee'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
      }}
    >
      {/* Score circle */}
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: `${scoreColor}15`,
        border: `2px solid ${scoreColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: '16px',
          fontWeight: 700,
          color: scoreColor,
        }}>
          {scan.score}
        </span>
      </div>

      {/* Job preview and date */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: '0 0 4px',
          fontSize: '13px',
          color: '#444',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {jobPreview}
        </p>
        <p style={{
          margin: 0,
          fontSize: '12px',
          color: '#999',
        }}>
          {date}
        </p>
      </div>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        style={{
          background: 'none',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          padding: '6px 12px',
          fontSize: '12px',
          color: '#dc2626',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        Delete
      </button>
    </div>
)
}