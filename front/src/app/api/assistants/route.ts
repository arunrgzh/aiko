import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function GET(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    const res = await fetch(
        `${process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/main/assistants/`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token?.accessToken}`,
            },
        },
    )
    console.log(res)
    if (!res.ok) throw new Error('error occured')
    return NextResponse.json(await res.json())
}
