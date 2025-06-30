'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import OnboardingLayout from './OnboardingLayout'
import PersonalInfoStep from './steps/PersonalInfoStep'
import ProfessionalInfoStep from './steps/ProfessionalInfoStep'
import SkillsAndPreferencesStep from './steps/SkillsAndPreferencesStep'
import AccessibilityStep from './steps/AccessibilityStep'
import CompletionStep from './steps/CompletionStep'
import { Spinner } from '@/components/ui/Spinner'
import Container from '@/components/shared/Container'
import {
    mapToBackendFormat,
    mapToFrontendFormat,
    type OnboardingProfileData,
} from '@/utils/onboardingMapper'

export type OnboardingData = {
    // Step 1: Personal Information
    first_name?: string
    last_name?: string
    phone?: string
    date_of_birth?: string
    gender?: string

    // Step 2: Disability & Work Conditions
    disability_type?: string[]
    disability_description?: string
    work_conditions?: string[]
    workplace_preferences?: string[]
    workplace_other?: string

    // Step 3: Skills & Experience
    skills?: string[]
    skills_other?: string
    desired_field?: string
    desired_field_other?: string

    // Step 4: Education & Learning
    education_status?: string
    wants_courses?: string
    learning_topics?: string[]
    learning_topics_other?: string

    // Step 5: Work Comfort & Assistance
    preferred_work_time?: string
    important_adaptations?: string[]
    adaptations_other?: string

    // Step 6: Platform Expectations
    platform_features?: string[]
    platform_features_other?: string

    // Step 7: Accessibility Issues
    accessibility_issues?: string[]
    accessibility_issues_other?: string

    // Step 8: Feedback
    feedback?: string

    // Step 9: Job Categories
    suitable_job_categories?: string[]
    job_features?: string[]
    employment_type?: string

    // Step 10: Extra Skills & Certifications
    extra_skills?: string
    certifications?: string

    // Step 3.5: Professional Info (optional)
    current_position?: string
    years_of_experience?: number
    industry?: string

    // Added for CompletionStep
    bio?: string
    linkedin_url?: string
    portfolio_url?: string
    preferred_job_types?: string[]
    preferred_locations?: string[]
}

const OnboardingPage = () => {
    const router = useRouter()
    const { session } = useCurrentSession()
    const [currentStep, setCurrentStep] = useState(1)
    const [onboardingData, setOnboardingData] = useState<OnboardingData>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const totalSteps = 5

    // Загрузить существующие данные онбординга
    const loadOnboardingData = useCallback(async () => {
        if (!session?.accessToken) return

        try {
            const response = await fetch('/api/onboarding/profile', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            })

            if (response.ok) {
                const backendData: OnboardingProfileData = await response.json()
                const frontendData = mapToFrontendFormat(backendData)
                setOnboardingData(frontendData)
            }
        } catch (error) {
            console.error('Error loading onboarding data:', error)
        }
    }, [session?.accessToken])

    // Автоматически сохранить данные
    const saveOnboardingData = useCallback(
        async (data: OnboardingData) => {
            if (!session?.accessToken) return

            try {
                const backendData = mapToBackendFormat(data)
                await fetch('/api/onboarding/profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                    body: JSON.stringify(backendData),
                })
            } catch (error) {
                console.error('Error saving onboarding data:', error)
            }
        },
        [session?.accessToken],
    )

    useEffect(() => {
        console.log('Onboarding useEffect - session:', session)
        console.log(
            'Onboarding useEffect - session?.accessToken:',
            session?.accessToken,
        )
        console.log(
            'Onboarding useEffect - session?.user?.isFirstLogin:',
            session?.user?.isFirstLogin,
        )

        // Проверяем, загружена ли сессия (есть ли accessToken)
        if (session?.accessToken) {
            // Если пользователь уже прошел онбординг
            if (!session.user.isFirstLogin) {
                console.log(
                    'Redirecting to dashboard - user already completed onboarding',
                )
                router.push('/main/dashboard')
            } else {
                // Загружаем существующие данные онбординга и показываем форму
                console.log('Loading onboarding data and showing form')
                loadOnboardingData().finally(() => {
                    setLoading(false)
                })
            }
        } else if (session?.user?.id) {
            // Если есть user.id но нет accessToken, показываем онбординг
            console.log(
                'Showing onboarding (no accessToken but has user) - setting loading to false',
            )
            setLoading(false)
        } else {
            // Если сессия еще не загружена, оставляем loading = true
            console.log('Session not loaded yet - keeping loading true')
        }
    }, [session, router, loadOnboardingData])

    // Автоматическое сохранение данных при их изменении
    useEffect(() => {
        if (Object.keys(onboardingData).length > 0 && session?.accessToken) {
            const timeoutId = setTimeout(() => {
                saveOnboardingData(onboardingData)
            }, 1000) // Сохраняем через 1 секунду после последнего изменения

            return () => clearTimeout(timeoutId)
        }
    }, [onboardingData, saveOnboardingData, session?.accessToken])

    // Таймаут для загрузки - если через 5 секунд сессия не загрузилась, показываем онбординг
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (loading) {
                console.log('Loading timeout - showing onboarding anyway')
                setLoading(false)
            }
        }, 5000)

        return () => clearTimeout(timeout)
    }, [loading])

    const updateOnboardingData = useCallback(
        (data: Partial<OnboardingData>) => {
            setOnboardingData((prev) => ({ ...prev, ...data }))
        },
        [],
    )

    const handleNext = useCallback(async () => {
        if (currentStep < totalSteps) {
            setCurrentStep((prev) => prev + 1)
        }
    }, [currentStep, totalSteps])

    const handlePrevious = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1)
        }
    }, [currentStep])

    const handleComplete = async () => {
        setSaving(true)
        try {
            // Сохраняем финальные данные онбординга
            const backendData = mapToBackendFormat(onboardingData)
            const response = await fetch('/api/onboarding/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify(backendData),
            })

            if (response.ok) {
                // Отмечаем онбординг как завершенный
                const completeResponse = await fetch(
                    '/api/onboarding/complete',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${session?.accessToken}`,
                        },
                        body: JSON.stringify({ mark_as_completed: true }),
                    },
                )

                if (completeResponse.ok) {
                    // Перенаправляем на дашборд
                    router.push('/main/dashboard')
                } else {
                    console.error('Error marking onboarding as completed')
                }
            } else {
                console.error('Error saving final onboarding data')
            }
        } catch (error) {
            console.error('Error completing onboarding:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleStepChange = useCallback(
        (step: number) => {
            if (step >= 1 && step <= totalSteps) {
                setCurrentStep(step)
            }
        },
        [totalSteps],
    )

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <PersonalInfoStep
                        data={onboardingData}
                        onUpdate={updateOnboardingData}
                        onNext={handleNext}
                    />
                )
            case 2:
                return (
                    <ProfessionalInfoStep
                        data={onboardingData}
                        onUpdate={updateOnboardingData}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                    />
                )
            case 3:
                return (
                    <SkillsAndPreferencesStep
                        data={onboardingData}
                        onUpdate={updateOnboardingData}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                    />
                )
            case 4:
                return (
                    <AccessibilityStep
                        data={onboardingData}
                        onUpdate={updateOnboardingData}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                    />
                )
            case 5:
                return (
                    <CompletionStep
                        data={onboardingData}
                        onUpdate={updateOnboardingData}
                        onComplete={handleComplete}
                        onPrevious={handlePrevious}
                        saving={saving}
                    />
                )
            default:
                return null
        }
    }

    if (loading) {
        return (
            <Container className="flex items-center justify-center h-screen">
                <Spinner size={40} />
            </Container>
        )
    }

    return (
        <OnboardingLayout
            currentStep={currentStep}
            totalSteps={totalSteps}
            onStepChange={handleStepChange}
        >
            {renderStep()}
        </OnboardingLayout>
    )
}

export default OnboardingPage
