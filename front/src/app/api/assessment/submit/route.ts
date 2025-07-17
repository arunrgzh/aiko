import { NextRequest, NextResponse } from 'next/server'
import getServerSession from '@/server/actions/auth/getServerSession'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession()

        if (!session?.accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const data = await request.json()

        const response = await fetch(`${BACKEND_URL}/api/assessment/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const error = await response.json()
            console.error('Backend assessment submit error:', error)
            return NextResponse.json(error, { status: response.status })
        }

        const result = await response.json()
        return NextResponse.json(result)
    } catch (error) {
        console.error('Error submitting assessment:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        )
    }
}
