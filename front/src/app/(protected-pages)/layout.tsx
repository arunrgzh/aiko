'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import appConfig from '@/configs/app.config'
import { Spinner } from '@/components/ui/Spinner'
import Container from '@/components/shared/Container'
import type { ReactNode } from 'react'

export default function ProtectedLayout({ children }: { children: ReactNode }) {
    const router = useRouter()
    const { session } = useCurrentSession()

    useEffect(() => {
        // Wait for session to be fully loaded
        if (!session) return

        // If no access token, redirect to sign in
        if (!session.accessToken) {
            router.replace(appConfig.signInEntryPath)
            return
        }

        // Store access token if authenticated (don't redirect for isFirstLogin here)
        if (session.accessToken) {
            localStorage.setItem('access_token', session.accessToken)
        }
    }, [session, router])

    // Show loading while session is being fetched
    if (!session) {
        return (
            <Container className="flex items-center justify-center h-screen w-screen">
                <Spinner size={40} />
            </Container>
        )
    }

    // Show loading if no access token (will redirect to sign-in)
    if (!session.accessToken) {
        return (
            <Container className="flex items-center justify-center h-screen w-screen">
                <Spinner size={40} />
            </Container>
        )
    }

    return <>{children}</>
}
