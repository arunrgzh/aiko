'use client'

import { useState, useMemo, useCallback } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Tabs from '@/components/ui/Tabs'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Spinner from '@/components/ui/Spinner'
import debounce from 'lodash/debounce'
import {
    TbUser,
    TbBrain,
    TbRefresh,
    TbFilter,
    TbSearch,
    TbTrendingUp,
    TbX,
    TbHeart,
} from 'react-icons/tb'
import VacancyCard from './VacancyCard'
import { JobRecommendation } from '../types'

type VacancyRecommendationsProps = {
    personalRecommendations: JobRecommendation[]
    assessmentRecommendations: JobRecommendation[]
    onRefresh?: () => void
    onFilter?: () => void
    onSearch?: (query: string) => Promise<JobRecommendation[]>
    onSave?: (id: number) => void
    onApply?: (id: number) => void
    onViewDetails?: (id: number) => void
    onDebugSkills?: () => void
    isLoading?: boolean
}

export default function VacancyRecommendations({
    personalRecommendations: initialPersonal,
    assessmentRecommendations: initialAssessment,
    onRefresh,
    onFilter,
    onSearch,
    onSave,
    onApply,
    onViewDetails,
    onDebugSkills,
    isLoading = false,
}: VacancyRecommendationsProps) {
    const [personalRecommendations, setPersonalRecommendations] =
        useState(initialPersonal)
    const [assessmentRecommendations, setAssessmentRecommendations] =
        useState(initialAssessment)
    const [activeTab, setActiveTab] = useState('personal')
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<JobRecommendation[]>([])
    const [isSearching, setIsSearching] = useState(false)

    const debouncedSearch = useCallback(
        debounce(async (query: string) => {
            if (query.trim() === '') {
                setSearchResults([])
                setIsSearching(false)
                return
            }
            if (onSearch) {
                setIsSearching(true)
                const results = await onSearch(query)
                setSearchResults(results)
                setIsSearching(false)
            }
        }, 500),
        [onSearch],
    )

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value
        setSearchQuery(query)
        debouncedSearch(query)
    }

    const clearSearch = () => {
        setSearchQuery('')
        setSearchResults([])
        setIsSearching(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            debouncedSearch.flush()
        }
        if (e.key === 'Escape') {
            clearSearch()
        }
    }

    const handleSave = (id: number) => {
        setPersonalRecommendations((recs) =>
            recs.map((vacancy) =>
                vacancy.id === id
                    ? { ...vacancy, is_saved: !vacancy.is_saved }
                    : vacancy,
            ),
        )
        setAssessmentRecommendations((recs) =>
            recs.map((vacancy) =>
                vacancy.id === id
                    ? { ...vacancy, is_saved: !vacancy.is_saved }
                    : vacancy,
            ),
        )
        onSave?.(id)
    }

    const recommendationsToShow = useMemo(() => {
        if (searchQuery.trim() !== '') {
            return searchResults
        }
        return activeTab === 'personal'
            ? personalRecommendations
            : assessmentRecommendations
    }, [
        searchQuery,
        searchResults,
        activeTab,
        personalRecommendations,
        assessmentRecommendations,
    ])

    const renderRecommendationBlock = (
        recommendations: JobRecommendation[],
        type: 'personal' | 'assessment' | 'search',
    ) => {
        const isSearchMode = type === 'search'
        const title = isSearchMode
            ? `Результаты поиска: "${searchQuery}"`
            : type === 'personal'
              ? 'Персональные рекомендации'
              : 'На основе тестирования'

        const description = isSearchMode
            ? `Найдено ${recommendations.length} вакансий`
            : type === 'personal'
              ? 'Вакансии, подобранные на основе ваших навыков и предпочтений'
              : 'Рекомендации на основе результатов профессионального тестирования'

        const icon = isSearchMode ? (
            <TbSearch />
        ) : type === 'personal' ? (
            <TbUser />
        ) : (
            <TbBrain />
        )

        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div
                            className={`p-2 rounded-lg ${
                                isSearchMode
                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                    : type === 'personal'
                                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                      : 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                            }`}
                        >
                            {icon}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {title}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recommendations Grid */}
                {isSearching ? (
                    <div className="flex justify-center items-center h-48">
                        <Spinner size={40} />
                    </div>
                ) : recommendations.length > 0 ? (
                    <div className="space-y-4">
                        {recommendations.map((vacancy) => (
                            <VacancyCard
                                key={vacancy.id}
                                vacancy={vacancy}
                                onSave={handleSave}
                                onApply={onApply}
                                onViewDetails={onViewDetails}
                            />
                        ))}
                    </div>
                ) : (
                    <Card className="p-8 text-center">
                        <div
                            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                                isSearchMode
                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                    : type === 'personal'
                                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                      : 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                            }`}
                        >
                            {icon}
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            {isSearchMode
                                ? 'Ничего не найдено'
                                : 'Рекомендации не найдены'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {isSearchMode
                                ? 'Попробуйте изменить ваш запрос'
                                : type === 'personal'
                                  ? 'Попробуйте обновить свой профиль или расширить критерии поиска'
                                  : 'Пройдите профессиональное тестирование для получения рекомендаций'}
                        </p>
                        {!isSearchMode && (
                            <Button
                                variant="plain"
                                onClick={onRefresh}
                                icon={<TbRefresh />}
                            >
                                Обновить рекомендации
                            </Button>
                        )}
                    </Card>
                )}
            </div>
        )
    }

    const isSearchActive = searchQuery.trim() !== ''

    return (
        <div className="space-y-6">
            {/* Top Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Персонализированные вакансии
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Подобранные специально для вас предложения работы
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    {/* Search */}
                    <Input
                        className="max-w-xs"
                        prefix={<TbSearch className="text-lg text-gray-400" />}
                        suffix={
                            searchQuery && (
                                <Button
                                    size="xs"
                                    variant="plain"
                                    icon={<TbX />}
                                    onClick={clearSearch}
                                />
                            )
                        }
                        placeholder="Поиск по вакансиям..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                    />

                    <Button
                        variant="plain"
                        onClick={onFilter}
                        icon={<TbFilter />}
                    >
                        Фильтры
                    </Button>

                    {/* Debug Skills Button - Development Only */}
                    {process.env.NODE_ENV === 'development' && (
                        <Button
                            variant="plain"
                            onClick={onDebugSkills}
                            className="text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/20"
                            title="Отладка навыков (только для разработки)"
                        >
                            🔍 Навыки
                        </Button>
                    )}

                    <Button
                        variant="solid"
                        onClick={onRefresh}
                        loading={isLoading && !isSearching}
                        icon={<TbRefresh />}
                    >
                        Обновить
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            {!isSearchActive && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <TbTrendingUp className="text-blue-600 dark:text-blue-400 text-xl" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {personalRecommendations.length +
                                        assessmentRecommendations.length}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Всего рекомендаций
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                <TbUser className="text-green-600 dark:text-green-400 text-xl" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {
                                        personalRecommendations.filter(
                                            (v) => v.relevance_score >= 0.8,
                                        ).length
                                    }
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Отлично подходят
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                                <TbHeart className="text-red-600 dark:text-red-400 text-xl" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {
                                        [
                                            ...personalRecommendations,
                                            ...assessmentRecommendations,
                                        ].filter((v) => v.is_saved).length
                                    }
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Сохраненные
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {isSearchActive ? (
                renderRecommendationBlock(searchResults, 'search')
            ) : (
                <>
                    <Tabs
                        value={activeTab}
                        onChange={(val) => setActiveTab(val)}
                    >
                        <Tabs.TabList>
                            <Tabs.TabNav value="personal">
                                Персональные ({personalRecommendations.length})
                            </Tabs.TabNav>
                            <Tabs.TabNav value="assessment">
                                По тестированию (
                                {assessmentRecommendations.length})
                            </Tabs.TabNav>
                        </Tabs.TabList>
                    </Tabs>
                    <div className="mt-6">
                        {activeTab === 'personal' &&
                            renderRecommendationBlock(
                                personalRecommendations,
                                'personal',
                            )}
                        {activeTab === 'assessment' &&
                            renderRecommendationBlock(
                                assessmentRecommendations,
                                'assessment',
                            )}
                    </div>
                </>
            )}
        </div>
    )
}
