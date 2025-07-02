import { NextRequest, NextResponse } from 'next/server'
import type { SignUpCredential } from '@/@types/auth'
import appConfig from '@/configs/app.config'

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as SignUpCredential
        console.log('API route received:', body)

        if (!body.username || !body.email || !body.password) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 },
            )
        }

        const apiUrl = appConfig.apiUrl
        console.log('Calling backend URL:', `${apiUrl}/api/auth/register`)

        const res = await fetch(`${apiUrl}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })

        const data = await res.json()
        console.log('FastAPI response:', data)

        if (!res.ok) {
            console.error('Backend registration failed:', {
                status: res.status,
                data: data,
            })
            const errorMessage =
                data.detail || data.message || data.error || 'Failed to sign up'
            return NextResponse.json(
                { error: errorMessage },
                { status: res.status },
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Signup error:', error)
        return NextResponse.json(
            { error: 'An error occurred during sign up' },
            { status: 500 },
        )
    }
}
