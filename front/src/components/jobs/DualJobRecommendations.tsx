'use client'

import React, { useState, useEffect } from 'react'
import {
    Card,
    Badge,
    Button,
    Spinner,
    Alert,
    Dialog,
} from '@/components/ui/index'
import {
    BriefcaseIcon,
    MapPinIcon,
    CurrencyDollarIcon,
    ClockIcon,
    AcademicCapIcon,
    StarIcon,
    ExternalLinkIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline'

interface JobRecommendation {
    id: number
    hh_vacancy_id: string
    title: string
    company_name?: string
    salary_from?: number
    salary_to?: number
    currency: string
    area_name?: string
    employment_type?: string
    experience_required?: string
    description?: string
    key_skills?: string[]
    relevance_score: number
    skills_match_score: number
    location_match_score: number
    salary_match_score: number
    recommendation_source: string
    source_explanation?: string
    detailed_scores?: Record<string, number>
    created_at: string
}

interface RecommendationBlock {
    source: string
    title: string
    description: string
    recommendations: JobRecommendation[]
    total_found: number
}

interface DualRecommendationData {
    personal_block: RecommendationBlock
    assessment_block?: RecommendationBlock
    user_has_assessment: boolean
    total_recommendations: number
    generated_at: string
}

interface VacancyDetails {
    success: boolean
    vacancy: any
    alternate_url: string
    has_contacts: boolean
}

const DualJobRecommendations: React.FC = () => {
    const [recommendations, setRecommendations] =
        useState<DualRecommendationData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedVacancy, setSelectedVacancy] =
        useState<VacancyDetails | null>(null)
    const [vacancyModalOpen, setVacancyModalOpen] = useState(false)
    const [loadingVacancy, setLoadingVacancy] = useState(false)

    useEffect(() => {
        fetchRecommendations()
    }, [])

    const fetchRecommendations = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch(
                '/api/enhanced-jobs/dual-recommendations?refresh=true',
                {
                    credentials: 'include',
                },
            )

            if (!response.ok) {
                throw new Error('Failed to fetch recommendations')
            }

            const data = await response.json()
            setRecommendations(data)
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Unknown error occurred',
            )
        } finally {
            setLoading(false)
        }
    }

    const handleVacancyClick = async (vacancyId: string) => {
        try {
            setLoadingVacancy(true)

            const response = await fetch(`/jobs/recommendations/${vacancyId}`, {
                credentials: 'include',
            })

            if (!response.ok) {
                throw new Error('Failed to fetch vacancy details')
            }

            const details = await response.json()
            setSelectedVacancy(details)
            setVacancyModalOpen(true)
        } catch (err) {
            console.error('Error fetching vacancy details:', err)
        } finally {
            setLoadingVacancy(false)
        }
    }

    const formatSalary = (from?: number, to?: number, currency = 'KZT') => {
        if (!from && !to) return 'Зарплата не указана'

        const formatNumber = (num: number) =>
            new Intl.NumberFormat('ru-KZ').format(num)

        if (from && to) {
            return `${formatNumber(from)} - ${formatNumber(to)} ${currency}`
        } else if (from) {
            return `от ${formatNumber(from)} ${currency}`
        } else if (to) {
            return `до ${formatNumber(to)} ${currency}`
        }
        return 'Зарплата не указана'
    }

    const getRelevanceColor = (score: number) => {
        if (score >= 0.8) return 'text-green-600 bg-green-100'
        if (score >= 0.6) return 'text-yellow-600 bg-yellow-100'
        return 'text-red-600 bg-red-100'
    }

    const renderJobCard = (job: JobRecommendation) => (
        <Card
            key={job.hh_vacancy_id}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
            <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">
                            {job.title}
                        </h3>
                        <p className="text-gray-600">{job.company_name}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge
                            variant="soft"
                            className={getRelevanceColor(job.relevance_score)}
                        >
                            {Math.round(job.relevance_score * 100)}% совпадение
                        </Badge>
                        {job.recommendation_source === 'assessment' && (
                            <Badge
                                variant="soft"
                                className="text-blue-600 bg-blue-100"
                            >
                                На основе теста
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Source explanation */}
                {job.source_explanation && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        <InformationCircleIcon className="h-4 w-4 flex-shrink-0" />
                        <span>{job.source_explanation}</span>
                    </div>
                )}

                {/* Job details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                        <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                        <span>
                            {formatSalary(
                                job.salary_from,
                                job.salary_to,
                                job.currency,
                            )}
                        </span>
                    </div>

                    {job.area_name && (
                        <div className="flex items-center space-x-2">
                            <MapPinIcon className="h-4 w-4 text-gray-400" />
                            <span>{job.area_name}</span>
                        </div>
                    )}

                    {job.employment_type && (
                        <div className="flex items-center space-x-2">
                            <ClockIcon className="h-4 w-4 text-gray-400" />
                            <span>{job.employment_type}</span>
                        </div>
                    )}

                    {job.experience_required && (
                        <div className="flex items-center space-x-2">
                            <AcademicCapIcon className="h-4 w-4 text-gray-400" />
                            <span>{job.experience_required}</span>
                        </div>
                    )}
                </div>

                {/* Skills */}
                {job.key_skills && job.key_skills.length > 0 && (
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                            Ключевые навыки:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {job.key_skills.slice(0, 6).map((skill, index) => (
                                <Badge key={index} variant="outline" size="sm">
                                    {skill}
                                </Badge>
                            ))}
                            {job.key_skills.length > 6 && (
                                <Badge variant="outline" size="sm">
                                    +{job.key_skills.length - 6} еще
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {/* Description preview */}
                {job.description && (
                    <div>
                        <p className="text-sm text-gray-600 line-clamp-3">
                            {job.description.replace(/<[^>]*>/g, '')}{' '}
                            {/* Remove HTML tags */}
                        </p>
                    </div>
                )}

                {/* Detailed scores */}
                {job.detailed_scores && (
                    <div className="border-t pt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                            Детальная оценка:
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            {Object.entries(job.detailed_scores).map(
                                ([key, value]) => (
                                    <div key={key} className="text-center">
                                        <div className="text-gray-600 capitalize">
                                            {key.replace('_', ' ')}
                                        </div>
                                        <div className="font-medium">
                                            {Math.round(
                                                (value as number) * 100,
                                            )}
                                            %
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-3 border-t">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleVacancyClick(job.hh_vacancy_id)}
                        disabled={loadingVacancy}
                    >
                        {loadingVacancy ? (
                            <Spinner size="sm" className="mr-2" />
                        ) : (
                            <BriefcaseIcon className="h-4 w-4 mr-2" />
                        )}
                        Подробнее
                    </Button>

                    <div className="flex space-x-2">
                        <Button variant="default" size="sm">
                            Сохранить
                        </Button>
                        <Button size="sm">Откликнуться</Button>
                    </div>
                </div>
            </div>
        </Card>
    )

    const renderRecommendationBlock = (block: RecommendationBlock) => (
        <div className="space-y-6">
            {/* Block header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            {block.title}
                        </h2>
                        <p className="text-gray-600">{block.description}</p>
                    </div>
                    <Badge variant="outline" className="text-lg font-semibold">
                        {block.total_found} вакансий
                    </Badge>
                </div>
            </div>

            {/* Jobs grid */}
            <div className="grid gap-6">
                {block.recommendations.map(renderJobCard)}
            </div>
        </div>
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <Spinner size="lg" className="mx-auto mb-4" />
                    <p className="text-gray-600">
                        Подбираем персональные рекомендации...
                    </p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <Alert
                variant="destructive"
                title="Ошибка загрузки"
                className="mb-6"
            >
                {error}
                <Button
                    variant="default"
                    size="sm"
                    onClick={fetchRecommendations}
                    className="mt-3"
                >
                    Попробовать снова
                </Button>
            </Alert>
        )
    }

    if (!recommendations) {
        return (
            <Alert variant="info" title="Нет рекомендаций" className="mb-6">
                Пока нет доступных рекомендаций. Убедитесь, что вы заполнили
                анкету.
            </Alert>
        )
    }

    return (
        <div className="space-y-8">
            {/* Personal recommendations block */}
            {renderRecommendationBlock(recommendations.personal_block)}

            {/* Assessment recommendations block */}
            {recommendations.user_has_assessment &&
                recommendations.assessment_block && (
                    <>
                        <div className="border-t border-gray-200 pt-8" />
                        {renderRecommendationBlock(
                            recommendations.assessment_block,
                        )}
                    </>
                )}

            {/* No assessment recommendations notice */}
            {!recommendations.user_has_assessment && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3">
                        <StarIcon className="h-6 w-6 text-blue-600" />
                        <div>
                            <h3 className="font-medium text-blue-900">
                                Получите больше рекомендаций
                            </h3>
                            <p className="text-blue-700 mt-1">
                                Пройдите профессиональный тест, чтобы получить
                                дополнительные рекомендации на основе ваших
                                сильных сторон
                            </p>
                            <Button
                                variant="default"
                                size="sm"
                                className="mt-3"
                            >
                                Пройти тест
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Vacancy details modal */}
            <Dialog open={vacancyModalOpen} onOpenChange={setVacancyModalOpen}>
                <Dialog.Content className="max-w-4xl">
                    <Dialog.Header>
                        <Dialog.Title>Детали вакансии</Dialog.Title>
                    </Dialog.Header>
                    {selectedVacancy && (
                        <div className="space-y-4">
                            {/* Vacancy details content */}
                            <div className="prose max-w-none">
                                <h3>{selectedVacancy.vacancy?.name}</h3>
                                <p>
                                    <strong>Компания:</strong>{' '}
                                    {selectedVacancy.vacancy?.employer?.name}
                                </p>

                                {selectedVacancy.vacancy?.description && (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: selectedVacancy.vacancy
                                                .description,
                                        }}
                                    />
                                )}
                            </div>

                            {/* Action buttons */}
                            <div className="flex justify-between pt-4 border-t">
                                <Button
                                    variant="default"
                                    onClick={() => setVacancyModalOpen(false)}
                                >
                                    Закрыть
                                </Button>

                                <div className="flex space-x-3">
                                    {selectedVacancy.has_contacts && (
                                        <Button variant="default">
                                            Показать контакты
                                        </Button>
                                    )}

                                    <Button
                                        onClick={() =>
                                            window.open(
                                                selectedVacancy.alternate_url,
                                                '_blank',
                                            )
                                        }
                                        className="flex items-center space-x-2"
                                    >
                                        <ExternalLinkIcon className="h-4 w-4" />
                                        <span>Откликнуться на hh.ru</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </Dialog.Content>
            </Dialog>

            {/* Summary footer */}
            <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-600">
                    Всего найдено{' '}
                    <strong>{recommendations.total_recommendations}</strong>{' '}
                    персональных рекомендаций
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    Обновлено:{' '}
                    {new Date(recommendations.generated_at).toLocaleString(
                        'ru-RU',
                    )}
                </p>
                <Button
                    variant="default"
                    size="sm"
                    onClick={fetchRecommendations}
                    className="mt-3"
                >
                    Обновить рекомендации
                </Button>
            </div>
        </div>
    )
}

export default DualJobRecommendations
