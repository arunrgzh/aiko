/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-use-before-define */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import OnboardingLayout from './OnboardingLayout'
import PersonalInfoStep from './steps/PersonalInfoStep'
import ProfessionalInfoStep from './steps/ProfessionalInfoStep'
import SkillsAndPreferencesStep from './steps/SkillsAndPreferencesStep'
import AccessibilityStep from './steps/AccessibilityStep'
import CompletionStep from './steps/CompletionStep'
import { Spinner } from '@/components/ui/Spinner'
import Container from '@/components/shared/Container'
import AssessmentQuestions from '@/components/shared/AssessmentQuestions'
import AssessmentService from '@/services/AssessmentService'
import type {
    AssessmentQuestion,
    AssessmentAnswer,
    AssessmentResult,
    ProfileSummary,
} from '@/services/AssessmentService'
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
    const { data: session, status } = useSession()
    const { update: updateSession } = useSession()
    const [currentStep, setCurrentStep] = useState(1)
    const [onboardingData, setOnboardingData] = useState<OnboardingData>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Assessment flow state
    const [assessmentQuestions, setAssessmentQuestions] = useState<
        AssessmentQuestion[]
    >([])
    const [assessmentResult, setAssessmentResult] =
        useState<AssessmentResult | null>(null)
    const [profileSummary, setProfileSummary] = useState<ProfileSummary | null>(
        null,
    )
    const [assessmentLoading, setAssessmentLoading] = useState(false)

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
        console.log('Onboarding useEffect - status:', status)
        console.log('Onboarding useEffect - session:', session)

        if (status === 'loading') return

        if (status === 'unauthenticated') {
            router.replace('/auth/sign-in')
            return
        }

        // Session is loaded
        setLoading(false)

        // Load data if authenticated
        if (session?.accessToken) {
            loadOnboardingData()
        }
    }, [status, session, router, loadOnboardingData])

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
            // Sохраняем финальные данные онбординга
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
                    // Обновляем сессию, чтобы получить актуальный isFirstLogin: false
                    await updateSession()
                    // Небольшая задержка чтобы сессия обновилась
                    await new Promise((resolve) => setTimeout(resolve, 500))
                    // Перенаправляем на assessment
                    router.push('/main/assessment')
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

    // Assessment handlers
    const handleAssessmentSubmit = useCallback(
        async (answers: AssessmentAnswer[]) => {
            setAssessmentLoading(true)
            try {
                const result = await AssessmentService.submitAssessment(answers)
                setAssessmentResult(result)

                // Get profile summary
                const summary = await AssessmentService.getProfileSummary()
                setProfileSummary(summary)
            } catch (error) {
                console.error('Error submitting assessment:', error)
            } finally {
                setAssessmentLoading(false)
            }
        },
        [],
    )

    const handleAssessmentComplete = useCallback(async () => {
        setSaving(true)
        try {
            // Mark onboarding as complete
            const completeResponse = await fetch('/api/onboarding/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify({ mark_as_completed: true }),
            })

            if (completeResponse.ok) {
                // Обновляем сессию, чтобы получить актуальный isFirstLogin: false
                await updateSession()
                // Небольшая задержка чтобы сессия обновилась
                await new Promise((resolve) => setTimeout(resolve, 500))
                router.push('/main/vacancies?completedOnboarding=true')
            } else {
                console.error('Error marking onboarding as completed')
            }
        } catch (error) {
            console.error('Error completing assessment:', error)
        } finally {
            setSaving(false)
        }
    }, [session?.accessToken, router])

    const handleRetakeAssessment = useCallback(() => {
        setAssessmentResult(null)
        setProfileSummary(null)
    }, [])

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

    // Debug current state
    console.log('🎨 Render state:', {
        loading,
        assessmentQuestions: assessmentQuestions.length,
        assessmentResult: !!assessmentResult,
        assessmentLoading,
    })

    if (loading) {
        return (
            <Container className="flex items-center justify-center h-screen">
                <Spinner size={40} />
            </Container>
        )
    }

    // Show assessment results
    if (assessmentResult) {
        return (
            <Container className="py-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        🎉 Результаты теста
                    </h1>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg mb-8">
                        <div className="text-6xl font-bold text-indigo-600 mb-4">
                            {assessmentResult.overall_score.toFixed(1)}/5
                        </div>
                        <h3 className="text-xl font-semibold mb-4">
                            Общий балл
                        </h3>

                        {/* Strengths */}
                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                            <div className="text-left">
                                <h4 className="text-lg font-semibold text-green-600 mb-3">
                                    ✅ Ваши сильные стороны:
                                </h4>
                                <ul className="space-y-2">
                                    {assessmentResult.top_strengths.map(
                                        (strength, index) => (
                                            <li
                                                key={index}
                                                className="text-gray-700 dark:text-gray-300"
                                            >
                                                • {strength.description} (
                                                {strength.score.toFixed(1)})
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>

                            <div className="text-left">
                                <h4 className="text-lg font-semibold text-amber-600 mb-3">
                                    💡 Области для развития:
                                </h4>
                                {assessmentResult.top_weaknesses.length > 0 ? (
                                    <ul className="space-y-2">
                                        {assessmentResult.top_weaknesses.map(
                                            (weakness, index) => (
                                                <li
                                                    key={index}
                                                    className="text-gray-700 dark:text-gray-300"
                                                >
                                                    • {weakness.description} (
                                                    {weakness.score.toFixed(1)})
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Отлично! Значительных областей для
                                        улучшения не выявлено.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="mt-8 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                            <h4 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-3">
                                🎯 Рекомендации:
                            </h4>
                            <p className="text-indigo-700 dark:text-indigo-300">
                                {assessmentResult.improvement_suggestions}
                            </p>
                        </div>

                        {/* Profile Summary */}
                        {profileSummary?.summary_text && (
                            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
                                    📋 Сводка профиля:
                                </h4>
                                <p className="text-blue-700 dark:text-blue-300">
                                    {profileSummary.summary_text}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={handleRetakeAssessment}
                            className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                            🔄 Пройти тест заново
                        </button>
                        <button
                            onClick={handleAssessmentComplete}
                            disabled={saving}
                            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all"
                        >
                            {saving ? 'Завершение...' : '✨ Найти вакансии'}
                        </button>
                    </div>
                </div>
            </Container>
        )
    }

    // Show assessment questions
    if (assessmentQuestions.length > 0) {
        return (
            <Container className="py-8">
                <AssessmentQuestions
                    questions={assessmentQuestions}
                    onSubmit={handleAssessmentSubmit}
                    loading={assessmentLoading}
                />
            </Container>
        )
    }

    // Show traditional onboarding or assessment choice
    return (
        <>
            <OnboardingLayout
                currentStep={currentStep}
                totalSteps={totalSteps}
                onStepChange={handleStepChange}
            >
                {renderStep()}
            </OnboardingLayout>
        </>
    )
}

export default OnboardingPage
