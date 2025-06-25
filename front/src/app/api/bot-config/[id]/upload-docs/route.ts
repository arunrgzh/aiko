import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'


export async function POST(req: NextRequest, { params }: { params: Promise<{ id: number }> }) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const id = (await params).id

    console.log('config id:', id)

    const form = await req.formData()
    console.log('route upload')
    const res = await fetch(`${process.env.API_URL}questionnaire_botconfig/botconfig/config/${id}/upload-docs/`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token?.accessToken}`,
        },
        body: form,
    })
    console.log('upload response',res)
    if (!res.ok) throw new Error('Ошибка при отправке формы')
    return NextResponse.json(await res.json())
}
