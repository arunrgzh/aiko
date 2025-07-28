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
import { useTranslations } from 'next-intl';

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
    const t = useTranslations();
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
            ? t('vacancies.recommendations.search.title', { query: searchQuery })
            : type === 'personal'
              ? t('vacancies.recommendations.personal.title')
              : t('vacancies.recommendations.assessment.title')

        const description = isSearchMode
            ? t('vacancies.recommendations.search.description', { count: recommendations.length })
            : type === 'personal'
              ? t('vacancies.recommendations.personal.description')
              : t('vacancies.recommendations.assessment.description')

        const icon = isSearchMode ? (
            <TbSearch />
        ) : type === 'personal' ? (
            <TbUser />
        ) : (
            <TbBrain />
        )

        return (
            <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="text-blue-600 dark:text-blue-400 text-xl">{icon}</div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
                        <p className="text-gray-600 dark:text-gray-400">{description}</p>
                    </div>
                </div>
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
                    <Card className="p-8 text-center mb-6 border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TbSearch className="text-gray-400 text-2xl" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            {isSearchMode
                                ? t('vacancies.recommendations.search.notFound')
                                : type === 'personal'
                                  ? t('vacancies.recommendations.personal.notFound')
                                  : t('vacancies.recommendations.assessment.notFound')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {isSearchMode
                                ? t('vacancies.recommendations.search.tryAgain')
                                : type === 'personal'
                                  ? t('vacancies.recommendations.personal.tryAgain')
                                  : t('vacancies.recommendations.assessment.tryAgain')}
                        </p>
                        {!isSearchMode && (
                            <Button
                                variant="plain"
                                onClick={onRefresh}
                                icon={<TbRefresh />}
                            >
                                {t('vacancies.recommendations.refresh')}
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
                        {t('vacancies.recommendations.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('vacancies.recommendations.subtitle')}
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    {/* Search */}
                    <Input
                        className="w-full lg:w-80"
                        prefix={<TbSearch className="text-lg text-gray-400" />}
                        placeholder={t('vacancies.recommendations.search.placeholder')}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        suffix={searchQuery && <Button size="xs" variant="plain" icon={<TbX />} onClick={clearSearch} />}
                    />

                    <Button
                        variant="plain"
                        onClick={onFilter}
                        icon={<TbFilter />}
                    >
                        {t('vacancies.recommendations.filter')}
                    </Button>

                    {/* Debug Skills Button - Development Only */}
                    {process.env.NODE_ENV === 'development' && (
                        <Button
                            variant="plain"
                            onClick={onDebugSkills}
                            className="text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/20"
                            title={t('vacancies.recommendations.debugSkills')}
                        >
                            🔍 {t('vacancies.recommendations.debugSkills')}
                        </Button>
                    )}

                    <Button
                        className="w-full lg:w-auto"
                        variant="solid"
                        onClick={onRefresh}
                        loading={isLoading && !isSearching}
                        icon={<TbRefresh />}
                    >
                        {t('vacancies.recommendations.refresh')}
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
                                    {[...personalRecommendations, ...assessmentRecommendations].length}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('vacancies.recommendations.stats.total')}
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
                                    {t('vacancies.recommendations.stats.excellentFit')}
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
                                    {t('vacancies.recommendations.stats.saved')}
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
                                {t('vacancies.recommendations.tabs.personal', { count: personalRecommendations.length })}
                            </Tabs.TabNav>
                            <Tabs.TabNav value="assessment">
                                {t('vacancies.recommendations.tabs.assessment', { count: assessmentRecommendations.length })}
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
