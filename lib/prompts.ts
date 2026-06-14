export const buildScanPrompt =  (
    resumeText:string,
    jobDescription :string
) => `
You are a senior technical recruiter with 10 years of experience.
Analyse this resume against the job description below.
Return ONLY valid JSON — no markdown, no backticks, no extra text.
 Resume : 
 ${resumeText.slice(0,3000)}

 Job Description: 
 ${jobDescription.slice(0,1500)}

 Return exactly this JSON shape:
 {
 "score": number between 0 and 100,
  "summary": "2 sentence overall assessment",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "gaps": ["missing skill 1", "missing skill 2", "missing skill 3"],
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2", "actionable suggestion 3"]
 }
`