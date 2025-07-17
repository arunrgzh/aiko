'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import appConfig from '@/configs/app.config'
import { Spinner } from '@/components/ui/Spinner'
import Container from '@/components/shared/Container'

export default function Page() {
    const router = useRouter()
    const { session } = useCurrentSession()

    useEffect(() => {
        // Check if we should always go to landing (for development/testing)
        const alwaysShowLanding =
            process.env.NEXT_PUBLIC_ALWAYS_SHOW_LANDING === 'true'

        if (alwaysShowLanding) {
            router.replace(appConfig.unAuthenticatedEntryPath)
            return
        }

        // Smart routing based on authentication state
        if (session?.accessToken !== undefined) {
            console.log('🏠 Root page routing - session:', {
                hasToken: !!session.accessToken,
                isFirstLogin: session.user?.isFirstLogin,
            })

            // Check if user needs onboarding
            if (session.user?.isFirstLogin) {
                console.log('🏠 Root page: Redirecting to onboarding')
                router.replace(appConfig.onboardingPath)
            } else {
                console.log('🏠 Root page: Redirecting to dashboard')
                router.replace(appConfig.authenticatedEntryPath)
            }
        } else {
            console.log('🏠 Root page: No session, redirecting to landing')
            router.replace(appConfig.unAuthenticatedEntryPath)
        }
    }, [session, router])

    return (
        <Container
            className={'flex items-center justify-center h-screen w-screen'}
        >
            <Spinner size={40}></Spinner>
        </Container>
    )
}
