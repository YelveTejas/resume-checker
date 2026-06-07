import { NextRequest, NextResponse } from "next/server";
import NextAuth, { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { extractText } from 'unpdf'



export async function POST(req: NextRequest) {
    const session = getServerSession(authOptions)
    if (!session) {
        return NextResponse.json(
            { error: 'You must be logged in' },
            { status: 401 }
        )
    }
    try {
        const formData = await req.formData()
        const file = formData.get('resume') as File
        if (!file) {
            return NextResponse.json(
                { error: 'No file Uploaded' },
                {
                    status: 400
                }
            )
        }
        if (file.type !== "application/pdf") {
            return NextResponse.json(
                { error: 'Invalid file type. Only PDF is allowed.' },
                {
                    status: 400
                }
            )
        }
        if (file.size > 2 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File size must be less than 2MB' },
                {
                    status: 400
                }
            )
        }

        const arraybuffer = await file.arrayBuffer()
         const buffer = new Uint8Array(arraybuffer)
        const { text } = await extractText(buffer, { mergePages: true })
        return NextResponse.json({
            success: true,
            text: text,
           
        })
    } catch (error) {
        console.error('PDF parse error', error)
        return NextResponse.json(
            {
                error: 'Internal server error'
            },
            {
                status: 500
            }
        )

    }
}