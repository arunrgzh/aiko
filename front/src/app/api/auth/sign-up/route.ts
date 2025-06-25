import { NextRequest, NextResponse } from 'next/server'
import type { SignUpCredential } from '@/@types/auth'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as SignUpCredential

        const res = await fetch('http://46.226.123.179:8081/api/signup/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),

        })

        const data = await res.json()

        return NextResponse.json(data, { status: res.status })
    } catch (error) {
        console.error('Signup error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

