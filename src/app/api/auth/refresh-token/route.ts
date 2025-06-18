import { NextRequest, NextResponse } from 'next/server'
import type { RefreshRequest } from '@/@types/auth'

export async function POST(req: NextRequest) {
    try {
        const { refreshToken } = (await req.json()) as RefreshRequest

        const res = await fetch('http://46.226.123.179:8081/api/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
        })

        const data = await res.json()
        return NextResponse.json(
            {
                accessToken: data.access,
                refreshToken: data.refresh || refreshToken,
            },
            { status: res.status },
        )
    } catch (err) {
        console.error('Refresh API error:', err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
