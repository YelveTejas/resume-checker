import { authOptions } from "@/lib/auth";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { buildScanPrompt } from "@/lib/prompts";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";



export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json(
            { error: 'You must be logged in' },
            { status: 401 }
        )
    }

    try {
        const { resumeText, jobDescription } = await req.json()
        if (!resumeText || resumeText.trim().length < 50) {
            return NextResponse.json({
                error: 'Resume text is too short'
            }, {
                status: 400
            })
        }
        if (!jobDescription || jobDescription.trim().length < 50) {
            return NextResponse.json(
                { error: 'Job description is too short' },
                { status: 400 }
            )
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const scanCount = await prisma.scan.count({
            where: {
                userId: session.user.id,
                createdAt: { gte: today },
            }
        })
         console.log(openai,'openai')
        if (scanCount >= 5) {
            return NextResponse.json(
                { error: 'You have reached your daily limit of 5 scans' },
                { status: 429 }
            )
        }
          
        const completion = await openai.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "user",
                    content: buildScanPrompt(resumeText, jobDescription)
                }
            ],
            temperature: 0.3,
        })

        const rawResponse = completion.choices[0]?.message.content ?? ""
        let feedback
        try {
            feedback = JSON.parse(rawResponse)
        }

        catch (error) {
            return NextResponse.json(
                { error: 'AI returned invalid response. Please try again.' },
                { status: 500 }
            )
        }
        const scan = await prisma.scan.create({
            data: {
                userId: session.user.id,
                resumeText,
                jobDescription,
                score: feedback.score,
                feedback
            }
        })

        return NextResponse.json({
            success: true,
            scanId: scan.id,
            feedback
        })

    } catch (error) {
        console.error('Scan error:', error)
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        )
    }
}