import { NextRequest, NextResponse } from 'next/server'
import type { RefreshRequest } from '@/@types/auth'

export async function POST(req: NextRequest) {
    try {
        const { refreshToken } = (await req.json()) as RefreshRequest

        const res = await fetch(
<<<<<<< HEAD
            `${process.env.NEXT_PUBLIC_API_URL || 'https://ai-komekshi.site/api'}/auth/refresh`,
=======
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/refresh`,
>>>>>>> 3abd56210396aa4ab1007ed780052fdf73c363e5
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: refreshToken }),
            },
        )

        const data = await res.json()
        return NextResponse.json(
            {
                accessToken: data.access_token,
                refreshToken: data.refresh_token || refreshToken,
            },
            { status: res.status },
        )
    } catch (err) {
        console.error('Refresh API error:', err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
