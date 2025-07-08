'use client'

import { useState, useEffect } from 'react'
// import {
//     LAYOUT_STACKED_SIDE,
//     LAYOUT_TOP_BAR_CLASSIC,
//     LAYOUT_FRAMELESS_SIDE,
//     LAYOUT_CONTENT_OVERLAY,
//     LAYOUT_BLANK,
// } from '@/constants/theme.constant'
// import FrameLessSide from './components/FrameLessSide'
// import StackedSide from './components/StackedSide'
import TopBarClassic from './components/TopBarClassic'
// import Blank from './components/Blank'
import PageContainer from '@/components/template/PageContainer'
import VirtualAssistant from '@/components/shared/VirtualAssistant'
import queryRoute from '@/utils/queryRoute'
// import useTheme from '@/utils/hooks/useTheme'
import { usePathname } from 'next/navigation'
import type { CommonProps } from '@/@types/common'
// import type { LayoutType } from '@/@types/theme'

// interface DashboardLayoutProps extends CommonProps {
//     layoutType: LayoutType
// }
//
// const Layout = ({ children, layoutType }: DashboardLayoutProps) => {
//     switch (layoutType) {
//         case LAYOUT_STACKED_SIDE:
//             return <StackedSide>{children}</StackedSide>
//         case LAYOUT_TOP_BAR_CLASSIC:
//             return <TopBarClassic>{children}</TopBarClassic>
//         case LAYOUT_FRAMELESS_SIDE:
//             return <FrameLessSide>{children}</FrameLessSide>
//         case LAYOUT_CONTENT_OVERLAY:
//             return <ContentOverlay>{children}</ContentOverlay>
//         case LAYOUT_BLANK:
//             return <Blank>{children}</Blank>
//         default:
//             return <>{children}</>
//     }
// }

const DashboardLayout = ({ children }: CommonProps) => {
    const pathname = usePathname()
    const [assistantVisible, setAssistantVisible] = useState(false)
    const [assistantDismissed, setAssistantDismissed] = useState(false)

    const route = queryRoute(pathname)

    // Customize assistant message based on current page
    const getAssistantMessage = () => {
        if (pathname?.includes('/vacancies')) {
            return 'Нужна помощь с поиском вакансий? Я помогу найти подходящие предложения!'
        }
        if (pathname?.includes('/dashboard')) {
            return 'Добро пожаловать! Могу помочь с навигацией по платформе или ответить на вопросы.'
        }
        if (pathname?.includes('/profile')) {
            return 'Помогу настроить ваш профиль и персональные данные.'
        }
        if (pathname?.includes('/settings')) {
            return 'Нужна помощь с настройками? Расскажу про все функции!'
        }
        return 'Привет! Я ваш персональный ассистент. Чем могу помочь?'
    }

    // Check if assistant should be shown on current page
    const shouldShowAssistant = () => {
        if (!pathname) return false

        // Don't show on onboarding, auth, or chat pages
        const excludedPaths = [
            '/onboarding',
            '/sign-in',
            '/sign-up',
            '/forgot-password',
            '/reset-password',
            '/main/ai-chat',
            '/auth',
        ]

        return !excludedPaths.some((path) => pathname.includes(path))
    }

    // Initialize assistant state from localStorage
    useEffect(() => {
        const dismissedUntil = localStorage.getItem('assistantDismissedUntil')
        if (dismissedUntil) {
            const dismissTime = parseInt(dismissedUntil, 10)
            if (Date.now() < dismissTime) {
                setAssistantDismissed(true)
            } else {
                localStorage.removeItem('assistantDismissedUntil')
            }
        }
    }, [])

    // Auto-show assistant after user spends some time on page
    useEffect(() => {
        if (!assistantDismissed && shouldShowAssistant()) {
            const timer = setTimeout(() => {
                setAssistantVisible(true)
            }, 5000) // Show after 5 seconds
            return () => clearTimeout(timer)
        }
    }, [pathname, assistantDismissed])

    const handleAssistantDismiss = () => {
        setAssistantVisible(false)
        setAssistantDismissed(true)

        // Store dismissal time in localStorage (30 minutes from now)
        const dismissUntil = Date.now() + 30 * 60 * 1000
        localStorage.setItem('assistantDismissedUntil', dismissUntil.toString())
    }

    return (
        <>
            <TopBarClassic>
                <PageContainer className={'h-screen'} {...route?.meta}>
                    {children}
                </PageContainer>
            </TopBarClassic>

            {/* Virtual Assistant - available on all pages except excluded ones */}
            {shouldShowAssistant() && (
                <VirtualAssistant
                    isVisible={assistantVisible && !assistantDismissed}
                    onDismiss={handleAssistantDismiss}
                    initialMessage={getAssistantMessage()}
                    showQuickActions={true}
                    autoShow={false}
                />
            )}
        </>
    )
}

export default DashboardLayout
