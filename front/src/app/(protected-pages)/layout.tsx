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
    const { session, status } = useCurrentSession() // status: "loading"|"authenticated"|"unauthenticated"

    useEffect(() => {
        if (status === 'loading') return

        if (status === 'unauthenticated') {
            router.replace(appConfig.signInEntryPath)
            return
        }

        if (session.user.isFirstLogin) {
            router.replace(appConfig.onboardingPath)
            return
        }
        if (session.accessToken) {
            localStorage.setItem('access_token', session.accessToken)
        } else {
            router.replace(appConfig.signInEntryPath)
            return
        }
    }, [status, session, router])

    if (status === 'loading') {
        return (
            <Container className="flex items-center justify-center h-screen w-screen">
                <Spinner size={40} />
            </Container>
        )
    }

    // while `useEffect` is triggering `router.replace`, we can return null
    if (status !== 'authenticated') {
        return null
    }

    return <>{children}</>
}
