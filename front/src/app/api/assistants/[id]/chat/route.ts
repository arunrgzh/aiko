import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: number }> },
) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const id = (await params).id
    console.log('assistant id:', id)

    const body = await req.json()
    console.log('route upload, body:', body)
    console.log(
        'url:',
        `${process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/main/assistants/${id}/chat`,
    )
    const res = await fetch(
        `${process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/main/assistants/${id}/chat`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token.accessToken}`,
            },
            body: JSON.stringify(body),
        },
    )

    console.log('upload response status:', res.status)

    if (!res.ok) {
        const errorText = await res.text()
        console.error('API error:', errorText)
        return NextResponse.json(
            { error: 'Ошибка при отправке формы', details: errorText },
            { status: res.status },
        )
    }

    const data = await res.json()
    return NextResponse.json(data)
}
