import { NextRequest, NextResponse } from 'next/server'
import getServerSession from '@/server/actions/auth/getServerSession'

const BACKEND_URL = process.env.BACKEND_URL || 'http://REDACTED:8000'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession()

        if (!session?.accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const assessmentType =
            searchParams.get('assessment_type') || 'skills_assessment'

        const response = await fetch(
            `${BACKEND_URL}/api/assessment/questions?assessment_type=${assessmentType}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.accessToken}`,
                },
            },
        )

        if (!response.ok) {
            const error = await response.json()
            console.error('Backend assessment questions error:', error)
            return NextResponse.json(error, { status: response.status })
        }

        const result = await response.json()
        return NextResponse.json(result)
    } catch (error) {
        console.error('Error fetching assessment questions:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        )
    }
}
