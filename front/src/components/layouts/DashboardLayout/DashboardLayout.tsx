'use client'

import { useState, useEffect } from 'react'
import TopBarClassic from './components/TopBarClassic'
import PageContainer from '@/components/template/PageContainer'
import VirtualAssistant from '@/components/shared/VirtualAssistant'
import queryRoute from '@/utils/queryRoute'
import { usePathname } from 'next/navigation'
import type { CommonProps } from '@/@types/common'

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
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            <TopBarClassic>
                <PageContainer
                    className="flex-1 px-4 md:px-6 py-4 md:py-6 overflow-hidden"
                    {...route?.meta}
                >
                    <div className="h-full overflow-auto">{children}</div>
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
                    className="fixed bottom-4 right-4 z-50"
                />
            )}
        </div>
    )
}

export default DashboardLayout
