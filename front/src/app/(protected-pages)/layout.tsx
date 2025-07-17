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

        // If first time login, redirect to onboarding immediately
        if (session.user?.isFirstLogin) {
            router.replace(appConfig.onboardingPath)
            return
        }

        // If we reach here, user is authenticated and not first login
        localStorage.setItem('access_token', session.accessToken)
    }, [session, router])

    // Show loading while session is being fetched or during redirects
    // But allow onboarding page to render if isFirstLogin true
    const isOnboardingPath =
        typeof window !== 'undefined' &&
        window.location.pathname === appConfig.onboardingPath

    if (!session) {
        return (
            <Container className="flex items-center justify-center h-screen w-screen">
                <Spinner size={40} />
            </Container>
        )
    }

    if (
        !session.accessToken ||
        (session.user?.isFirstLogin && !isOnboardingPath)
    ) {
        return (
            <Container className="flex items-center justify-center h-screen w-screen">
                <Spinner size={40} />
            </Container>
        )
    }

    return <>{children}</>
}
