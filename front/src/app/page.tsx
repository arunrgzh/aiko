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
        if (session?.accessToken !== undefined) {
            // Check if user needs onboarding
            if (session.user.isFirstLogin) {
                router.push(appConfig.onboardingPath)
            } else {
                router.push(appConfig.authenticatedEntryPath)
            }
        } else {
            router.push(appConfig.unAuthenticatedEntryPath)
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
