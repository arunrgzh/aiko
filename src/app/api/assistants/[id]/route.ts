import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'


export async function GET(req: NextRequest, { params }: { params: Promise<{ id: number }> }) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const id = (await params).id

    console.log('assistant id:', id)

    const res = await fetch(`${process.env.API_URL}main/assistants/${id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token?.accessToken}`,
        },
    })

    if (!res.ok) throw new Error('Ошибка при получения ассистента')
    return NextResponse.json(await res.json())
}
