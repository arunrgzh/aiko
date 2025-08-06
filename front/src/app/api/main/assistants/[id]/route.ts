import { NextRequest, NextResponse } from 'next/server'
import getServerSession from '@/server/actions/auth/getServerSession'

const BACKEND_URL =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:8000'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await getServerSession()

        if (!session?.accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        console.log('Getting assistant:', id)

        const response = await fetch(
            `${BACKEND_URL}/api/main/assistants/${id}`,
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
            console.error('Backend assistant error:', error)
            return NextResponse.json(error, { status: response.status })
        }

        const result = await response.json()
        return NextResponse.json(result)
    } catch (error) {
        console.error('Error fetching assistant:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        )
    }
}
