import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { params } = await request.json()

        // Строим URL для HeadHunter API
        const url = new URL('https://api.hh.ru/vacancies')

        // Добавляем параметры поиска
        Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v) => url.searchParams.append(key, v))
            } else if (value !== undefined && value !== null) {
                url.searchParams.append(key, value as string)
            }
        })

        // Дополнительные параметры
        url.searchParams.append('per_page', '20')
        url.searchParams.append('page', '0')
        url.searchParams.append('order_by', 'relevance')

        const response = await fetch(url.toString(), {
            headers: {
                'User-Agent': 'AI-Komekshi/1.0 (contact@ai-komekshi.kz)',
            },
        })

        if (!response.ok) {
            console.error(
                'HeadHunter API error:',
                response.status,
                await response.text(),
            )
            throw new Error('HeadHunter API error')
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error searching HeadHunter:', error)
        return NextResponse.json(
            { error: 'Failed to search vacancies' },
            { status: 500 },
        )
    }
}
