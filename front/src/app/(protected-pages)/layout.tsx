'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import appConfig from '@/configs/app.config'
import { Spinner } from '@/components/ui/Spinner'
import Container from '@/components/shared/Container'
import type { ReactNode } from 'react'

interface ProtectedLayoutProps {
    children: ReactNode
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
    const router = useRouter()
    const { session } = useCurrentSession()

    useEffect(() => {
        // If no session or no access token, redirect to sign-in
        if (session?.accessToken === undefined) {
            // Still loading session, wait a bit
            return
        }

        if (!session.accessToken) {
            // No valid session, redirect to sign-in
            router.push(appConfig.signInEntryPath)
            return
        }

        // If user is on first login, redirect to onboarding
        if (session.user.isFirstLogin) {
            router.push(appConfig.onboardingPath)
            return
        }
    }, [session, router])

    // Show loading while checking session
    if (session?.accessToken === undefined) {
        return (
            <Container className="flex items-center justify-center h-screen w-screen">
                <Spinner size={40} />
            </Container>
        )
    }

    // Show loading if no valid session (will redirect)
    if (!session.accessToken) {
        return (
            <Container className="flex items-center justify-center h-screen w-screen">
                <Spinner size={40} />
            </Container>
        )
    }

    // Render children if authenticated
    return <>{children}</>
}
