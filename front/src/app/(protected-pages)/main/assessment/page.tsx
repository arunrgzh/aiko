'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import AssessmentQuestions from '@/components/shared/AssessmentQuestions'
import AssessmentService from '@/services/AssessmentService'
import { Spinner } from '@/components/ui/Spinner'
import Container from '@/components/shared/Container'
import type {
    AssessmentQuestion,
    AssessmentAnswer,
    AssessmentResult,
    ProfileSummary,
} from '@/services/AssessmentService'

const AssessmentPage = () => {
    const router = useRouter()
    const { session } = useCurrentSession()
    const { update: updateSession } = useSession()
    const [questions, setQuestions] = useState<AssessmentQuestion[]>([])
    const [loading, setLoading] = useState(true)
    const [assessmentLoading, setAssessmentLoading] = useState(false)
    const [assessmentResult, setAssessmentResult] =
        useState<AssessmentResult | null>(null)
    const [profileSummary, setProfileSummary] = useState<ProfileSummary | null>(
        null,
    )
    const [saving, setSaving] = useState(false)

    // Load assessment questions on mount
    useEffect(() => {
        const loadQuestions = async () => {
            try {
                console.log('Loading assessment questions...')
                const questionsData = await AssessmentService.getQuestions()
                setQuestions(questionsData.questions)
            } catch (error) {
                console.error('Error loading assessment questions:', error)
            } finally {
                setLoading(false)
            }
        }

        if (session?.accessToken) {
            loadQuestions()
        }
    }, [session?.accessToken])

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
            // Mark onboarding as complete if not already done
            const completeResponse = await fetch('/api/onboarding/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify({ mark_as_completed: true }),
            })

            if (completeResponse.ok) {
                // Update session to reflect completion
                await updateSession()
                // Small delay for session propagation
                await new Promise((resolve) => setTimeout(resolve, 500))
                // Redirect to vacancies
                router.push('/main/vacancies')
            } else {
                console.error('Error marking assessment as completed')
            }
        } catch (error) {
            console.error('Error completing assessment:', error)
        } finally {
            setSaving(false)
        }
    }, [session?.accessToken, router, updateSession])

    const handleRetakeAssessment = useCallback(() => {
        setAssessmentResult(null)
        setProfileSummary(null)
    }, [])

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
    if (questions.length > 0) {
        return (
            <Container className="py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Тест на оценку навыков
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Пройдите тест, чтобы мы могли лучше подобрать вам
                            подходящие вакансии
                        </p>
                    </div>
                    <AssessmentQuestions
                        questions={questions}
                        onSubmit={handleAssessmentSubmit}
                        loading={assessmentLoading}
                    />
                </div>
            </Container>
        )
    }

    // No questions loaded
    return (
        <Container className="py-8">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Тест недоступен
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    К сожалению, не удалось загрузить вопросы для теста.
                </p>
                <button
                    onClick={() => router.push('/main/vacancies')}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Перейти к вакансиям
                </button>
            </div>
        </Container>
    )
}

export default AssessmentPage
