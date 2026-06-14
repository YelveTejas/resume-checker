'use client'
interface Feedback {
    score:number,
    summary:string,
    strengths:string[]
    gaps:string[]
    suggestions:string[]
}

interface Props {
    feedback:Feedback
}


export default function ScanResults({feedback}:Props){
    const scoreColor = 
    feedback.score >= 70 ? "#16a34a":
    feedback.score >= 40 ? '#d97706' : '#dc2626'
  return (
   <div  className="mt-[32px] border border-solid border-black">
    <div
    style={{
      textAlign: 'center',
        padding: '32px',
        background: '#fafafa',
        borderRadius: '12px',
        marginBottom: '24px',
        border: '1px solid #eee'  
    }} 
    >
        <div style={{
            fontSize: '64px',
          fontWeight: 700,
          color: scoreColor,
          lineHeight: 1
        }}>
           {feedback.score}
        </div>
        <div style={{fontSize:'16px',color:"#888",marginTop:"8px"}}>
         Match Score out of 100
        </div>
         <p style={{
            marginTop: '16px',
          fontSize: '14px',
          color: '#444',
          maxWidth: '500px',
          margin: '16px auto 0'
         }}>
           {feedback.summary}
         </p>
    </div>
     <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>

        {/* Strengths */}
        <div style={{
          padding: '20px',
          background: '#f0fdf4',
          borderRadius: '12px',
          border: '1px solid #bbf7d0'
        }}>
          <h3 style={{ color: '#16a34a', marginTop: 0 }}>✅ Strengths</h3>
          <ul style={{ paddingLeft: '16px', margin: 0 }}>
            {feedback.suggestions.map((item, i) => (
              <li key={i} style={{
                fontSize: '13px',
                color: '#444',
                marginBottom: '8px'
              }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Gaps */}
        <div style={{
          padding: '20px',
          background: '#fff7ed',
          borderRadius: '12px',
          border: '1px solid #fed7aa'
        }}>
          <h3 style={{ color: '#d97706', marginTop: 0 }}>⚠️ Gaps</h3>
          <ul style={{ paddingLeft: '16px', margin: 0 }}>
            {feedback.gaps.map((item, i) => (
              <li key={i} style={{
                fontSize: '13px',
                color: '#444',
                marginBottom: '8px'
              }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Suggestions */}
        <div style={{
          padding: '20px',
          background: '#eff6ff',
          borderRadius: '12px',
          border: '1px solid #bfdbfe'
        }}>
          <h3 style={{ color: '#2563eb', marginTop: 0 }}>💡 Suggestions</h3>
          <ul style={{ paddingLeft: '16px', margin: 0 }}>
            {feedback.strengths.map((item, i) => (
              <li key={i} style={{
                fontSize: '13px',
                color: '#444',
                marginBottom: '8px'
              }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>
   </div>
  )
}