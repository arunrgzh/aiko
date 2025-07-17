import { NextRequest, NextResponse } from 'next/server'
import getServerSession from '@/server/actions/auth/getServerSession'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession()

        if (!session?.accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const page = searchParams.get('page') || '1'
        const per_page = searchParams.get('per_page') || '20'
        const refresh = searchParams.get('refresh') || 'false'
        const disable_filters = searchParams.get('disable_filters') || 'false'

        const url = new URL(
            `${BACKEND_URL}/api/enhanced-jobs/dual-recommendations`,
        )
        url.searchParams.append('page', page)
        url.searchParams.append('per_page', per_page)
        url.searchParams.append('refresh', refresh)
        url.searchParams.append('disable_filters', disable_filters)

        console.log('🔍 Making request to backend:', url.toString())

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.accessToken}`,
            },
        })

        if (!response.ok) {
            const error = await response.json()
            console.error('Backend dual recommendations error:', error)
            return NextResponse.json(error, { status: response.status })
        }

        const result = await response.json()
        console.log('✅ Backend response:', {
            totalRecommendations: result.total_recommendations,
            personalCount: result.personal_block?.recommendations?.length || 0,
            assessmentCount:
                result.assessment_block?.recommendations?.length || 0,
            userHasAssessment: result.user_has_assessment,
        })

        return NextResponse.json(result)
    } catch (error) {
        console.error('Error fetching dual recommendations:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        )
    }
}
