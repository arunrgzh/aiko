'use client'

import { useState, useEffect } from 'react'
import VacancyGenerationLoader from './_components/VacancyGenerationLoader'
import VacancyRecommendations from './_components/VacancyRecommendations'
import vacancyService from '@/services/VacancyService'
import { JobRecommendation, DualRecommendationResponse } from './types'

export default function VacanciesPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [showLoader, setShowLoader] = useState(true)
    const [personalRecommendations, setPersonalRecommendations] = useState<
        JobRecommendation[]
    >([])
    const [assessmentRecommendations, setAssessmentRecommendations] = useState<
        JobRecommendation[]
    >([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadPersonalizedVacancies()
    }, [])

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
        <VacancyRecommendations
            personalRecommendations={personalRecommendations}
            assessmentRecommendations={assessmentRecommendations}
            onRefresh={handleRefresh}
            onFilter={handleFilter}
            onSearch={handleSearch}
            onSave={handleSaveVacancy}
            onApply={handleApplyToVacancy}
            onViewDetails={handleViewDetails}
            isLoading={isLoading}
        />
    )
}
