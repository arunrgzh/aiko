'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import VacancyGenerationLoader from './_components/VacancyGenerationLoader'
import VacancyRecommendations from './_components/VacancyRecommendations'
import AssistantSuggestion from '@/components/shared/AssistantSuggestion'
import AssessmentChoiceModal from '@/components/shared/AssessmentChoiceModal'
import AssessmentService from '@/services/AssessmentService'
import vacancyService from '@/services/VacancyService'
import { JobRecommendation } from './types'

export default function VacanciesPage() {
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(true)
    const [showLoader, setShowLoader] = useState(true)
    const [personalRecommendations, setPersonalRecommendations] = useState<
        JobRecommendation[]
    >([])
    const [assessmentRecommendations, setAssessmentRecommendations] = useState<
        JobRecommendation[]
    >([])
    const [error, setError] = useState<string | null>(null)

    // Assistant suggestion state
    const [showAssistantSuggestion, setShowAssistantSuggestion] =
        useState(false)
    const [showAssessmentChoice, setShowAssessmentChoice] = useState(false)
    const [assessmentLoading, setAssessmentLoading] = useState(false)

    useEffect(() => {
        loadPersonalizedVacancies()

        // Check if user just completed onboarding
        const shouldShowAssistant = searchParams.get('showAssistant') === '1'
        if (shouldShowAssistant) {
            // Show assistant suggestion after a short delay
            setTimeout(() => {
                setShowAssistantSuggestion(true)
            }, 2000) // 2 seconds after page load
        }
    }, [searchParams])

    const loadPersonalizedVacancies = async () => {
        try {
            setIsLoading(true)
            setError(null)

            // Get dual recommendations from enhanced service
            const dualResponse = await vacancyService.getDualRecommendations()

            // Extract recommendations from blocks
            setPersonalRecommendations(
                dualResponse.personal_block?.recommendations || [],
            )

            if (
                dualResponse.assessment_block &&
                dualResponse.user_has_assessment
            ) {
                setAssessmentRecommendations(
                    dualResponse.assessment_block.recommendations || [],
                )
            } else {
                setAssessmentRecommendations([])
            }
        } catch (err) {
            console.error('Error loading personalized vacancies:', err)
            setError('Ошибка при загрузке персонализированных вакансий')

            // Try fallback to legacy endpoint
            try {
                const fallbackResponse =
                    await vacancyService.getPersonalizedRecommendations()
                setPersonalRecommendations(
                    fallbackResponse.recommendations || [],
                )
                setAssessmentRecommendations([])
                setError(null) // Clear error if fallback succeeds
            } catch (fallbackErr) {
                console.error('Fallback also failed:', fallbackErr)
            }
        } finally {
            setIsLoading(false)
            // Hide loader after a minimum time for better UX
            setTimeout(() => setShowLoader(false), 500)
        }
    }

    const handleSaveVacancy = async (id: number) => {
        try {
            await vacancyService.saveJobRecommendation(id, true)
            // Update local state to reflect saved status
            setPersonalRecommendations((prev) =>
                prev.map((rec) =>
                    rec.id === id ? { ...rec, is_saved: true } : rec,
                ),
            )
            setAssessmentRecommendations((prev) =>
                prev.map((rec) =>
                    rec.id === id ? { ...rec, is_saved: true } : rec,
                ),
            )
        } catch (err) {
            console.error('Error saving vacancy:', err)
        }
    }

    const handleApplyToVacancy = async (id: number) => {
        try {
            await vacancyService.applyToJob(id)
            // Optionally show success notification or redirect
            console.log('Successfully applied to vacancy:', id)
        } catch (err) {
            console.error('Error applying to vacancy:', err)
        }
    }

    const handleViewDetails = async (id: number) => {
        try {
            // Find the vacancy in either recommendation list
            const vacancy = [
                ...personalRecommendations,
                ...assessmentRecommendations,
            ].find((rec) => rec.id === id)

            if (vacancy?.hh_vacancy_id) {
                const details = await vacancyService.getVacancyDetails(
                    vacancy.hh_vacancy_id,
                )

                if (details.success && details.alternate_url) {
                    // Open HeadHunter vacancy page in new tab
                    window.open(details.alternate_url, '_blank')
                } else {
                    console.log('Vacancy details:', details)
                }
            }
        } catch (err) {
            console.error('Error viewing vacancy details:', err)
        }
    }

    const handleSearch = async (query: string) => {
        try {
            setIsLoading(true)
            const response = await vacancyService.searchVacancies({
                text: query,
            })
            // Update recommendations with search results
            setPersonalRecommendations(response.recommendations || [])
            setAssessmentRecommendations([]) // Clear assessment recommendations during search
        } catch (err) {
            console.error('Error searching vacancies:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleFilter = () => {
        // Open filter modal or sidebar
        console.log('Opening filters')
    }

    const handleRefresh = async () => {
        setShowLoader(true)
        await loadPersonalizedVacancies()
    }

    // Assessment flow handlers
    const handleChooseAssessment = async () => {
        setShowAssistantSuggestion(false)
        setAssessmentLoading(true)
        try {
            const choiceResult = await AssessmentService.chooseAssessmentOption(
                {
                    take_assessment: true,
                    skip_onboarding_data: false,
                },
            )
            console.log('Assessment option chosen:', choiceResult)
            setShowAssessmentChoice(true)
        } catch (error) {
            console.error('Error starting assessment:', error)
            alert(
                'Произошла ошибка при загрузке теста. Пожалуйста, попробуйте еще раз.',
            )
        } finally {
            setAssessmentLoading(false)
        }
    }

    const handleDismissAssistant = () => {
        setShowAssistantSuggestion(false)
        // Clear the query parameter to prevent showing again
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href)
            url.searchParams.delete('showAssistant')
            window.history.replaceState({}, '', url.toString())
        }
    }

    // Debug skills handler for development
    const handleDebugSkills = async () => {
        try {
            const debugInfo = await vacancyService.debugUserSkills()
            console.group('🔍 Skills Debug Information')
            console.log('User ID:', debugInfo.user_id)
            console.log('Onboarding Completed:', debugInfo.onboarding_completed)
            console.log('Onboarding Skills:', debugInfo.onboarding_skills)
            console.log('Preferences Exist:', debugInfo.preferences_exist)
            console.log('Preferred Skills:', debugInfo.preferred_skills)
            console.log('Preferred Job Titles:', debugInfo.preferred_job_titles)
            console.log('Preferred Areas:', debugInfo.preferred_areas)
            console.log(
                'Recent Recommendations:',
                debugInfo.recent_recommendations,
            )
            console.groupEnd()

            // Also show a user-friendly alert
            alert(`Информация о навыках:
• Онбординг завершен: ${debugInfo.onboarding_completed ? 'Да' : 'Нет'}
• Навыки из онбординга: ${debugInfo.onboarding_skills?.length || 0}
• Настройки созданы: ${debugInfo.preferences_exist ? 'Да' : 'Нет'} 
• Предпочитаемые навыки: ${debugInfo.preferred_skills?.length || 0}
• Последние рекомендации: ${debugInfo.recent_recommendations?.length || 0}

Подробности в консоли браузера (F12)`)
        } catch (err) {
            console.error('Error debugging skills:', err)
            alert('Ошибка при получении информации о навыках')
        }
    }

    // Show loader during initial load or when explicitly loading
    if (showLoader || (isLoading && personalRecommendations.length === 0)) {
        return <VacancyGenerationLoader />
    }

    // Show error state if there's an error and no data
    if (error && personalRecommendations.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Ошибка загрузки
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {error}
                    </p>
                    <button
                        onClick={loadPersonalizedVacancies}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Попробовать снова
                    </button>
                </div>
            </div>
        )
    }

    return (
        <>
            <VacancyRecommendations
                personalRecommendations={personalRecommendations}
                assessmentRecommendations={assessmentRecommendations}
                onRefresh={handleRefresh}
                onFilter={handleFilter}
                onSearch={handleSearch}
                onSave={handleSaveVacancy}
                onApply={handleApplyToVacancy}
                onViewDetails={handleViewDetails}
                onDebugSkills={handleDebugSkills}
                isLoading={isLoading}
            />

            {/* Assistant Suggestion for post-onboarding assessment */}
            <AssistantSuggestion
                isVisible={showAssistantSuggestion}
                onTakeAssessment={handleChooseAssessment}
                onDismiss={handleDismissAssistant}
                uncertaintyReason="Теперь, когда ваш профиль настроен, хотите пройти быстрый тест для более точных рекомендаций?"
            />

            {/* Assessment Choice Modal */}
            <AssessmentChoiceModal
                isOpen={showAssessmentChoice}
                onClose={() => setShowAssessmentChoice(false)}
                onChooseAssessment={() => {
                    // Handle assessment start - redirect to assessment page or show questions
                    window.location.href = '/onboarding'
                }}
                onChooseTraditional={() => {
                    setShowAssessmentChoice(false)
                }}
                loading={assessmentLoading}
            />
        </>
    )
}
