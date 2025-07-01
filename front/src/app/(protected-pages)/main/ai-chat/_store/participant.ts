'use client'

import { useState, useEffect, useCallback } from 'react'

const PARTICIPANT_KEY = 'participant_key'

export function useParticipant(): [
    string | null,
    (value: string) => void,
    () => void,
] {
    const [participant, setParticipantState] = useState<string | null>(null)

    useEffect(() => {
        if (typeof window === 'undefined') return
        const stored = localStorage.getItem(PARTICIPANT_KEY)
        setParticipantState(stored)
    }, [])

    const setParticipant = useCallback((value: string) => {
        if (typeof window === 'undefined') return
        localStorage.setItem(PARTICIPANT_KEY, value)
        setParticipantState(value)
    }, [])

    const removeParticipant = useCallback(() => {
        if (typeof window === 'undefined') return
        localStorage.removeItem(PARTICIPANT_KEY)
        setParticipantState(null)
    }, [])

    return [participant, setParticipant, removeParticipant]
}
