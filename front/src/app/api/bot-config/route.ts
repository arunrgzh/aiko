import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function POST(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const body = await req.json()

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/questionnaire_botconfig/botconfig/config/`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token?.accessToken}`,
            },
            body: JSON.stringify(body),
        },
    )
    console.log(res)
    if (!res.ok) throw new Error('error occured')
    return NextResponse.json(await res.json())
}
