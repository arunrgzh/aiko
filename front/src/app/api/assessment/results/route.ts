import { NextRequest, NextResponse } from 'next/server'
import getServerSession from '@/server/actions/auth/getServerSession'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession()

        if (!session?.accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const response = await fetch(`${BACKEND_URL}/assessment/results`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.accessToken}`,
            },
        })

        if (!response.ok) {
            const error = await response.json()
            return NextResponse.json(error, { status: response.status })
        }

        const result = await response.json()
        return NextResponse.json(result)
    } catch (error) {
        console.error('Error fetching assessment results:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        )
    }
}
