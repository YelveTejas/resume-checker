import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json(
            { error: "You must be logged in" },
            { status: 401 }
        )
    }

    try {
        const scans = await prisma.scan.findMany({
            where: { userId: session?.user.id },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                score: true,
                jobDescription: true,
                createdAt: true,
                feedback: true,
            }
        })
        return NextResponse.json({
            scans
        })
    } catch (error) {
        console.error('Scan history error:', error)
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        )
    }
}



export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json(
            { error: "You must be logged in" },
            { status: 401 }
        )
    }
    try {
        const { scanId } = await req.json()
        const scan = await prisma.scan.findUnique({
            where: { id: scanId }
        })
        if (!scan || scan.userId !== session.user.id) {
            return NextResponse.json(
                { error: 'scan not found' },
                { status: 404 }
            )
        }
        await prisma.scan.delete({
            where: { id: scanId }
        })
        return NextResponse.json({
            success: true,
            deletedId: scanId
        })

    } catch (error) {
        console.error('Scan history error:', error)
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        )
    }
}