'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
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
import { useTranslations } from 'next-intl'

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
    const t = useTranslations('vacancies')
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

    // Update local state when props change
    useEffect(() => {
        setPersonalRecommendations(initialPersonal)
    }, [initialPersonal])

    useEffect(() => {
        setAssessmentRecommendations(initialAssessment)
    }, [initialAssessment])

    const allRecommendations = useMemo(() => {
        if (searchQuery.trim()) {
            return searchResults
        }
        return [...personalRecommendations, ...assessmentRecommendations]
    }, [
        searchQuery,
        searchResults,
        personalRecommendations,
        assessmentRecommendations,
    ])

    const hasPersonalRecommendations = personalRecommendations.length > 0
    const hasAssessmentRecommendations = assessmentRecommendations.length > 0
    const hasSearchResults = searchQuery.trim() && searchResults.length > 0

    const tabs = useMemo(() => {
        const tabList = []

        if (hasPersonalRecommendations || !hasAssessmentRecommendations) {
            tabList.push({
                key: 'personal',
                label: t('recommendations.personal.title'),
                count: personalRecommendations.length,
                icon: <TbUser className="w-4 h-4" />,
            })
        }

        if (hasAssessmentRecommendations) {
            tabList.push({
                key: 'assessment',
                label: t('recommendations.assessment.title'),
                count: assessmentRecommendations.length,
                icon: <TbBrain className="w-4 h-4" />,
            })
        }

        if (hasSearchResults) {
            tabList.push({
                key: 'search',
                label: t('recommendations.search.title', {
                    query: searchQuery,
                }),
                count: searchResults.length,
                icon: <TbSearch className="w-4 h-4" />,
            })
        }

        return tabList
    }, [
        hasPersonalRecommendations,
        hasAssessmentRecommendations,
        hasSearchResults,
        personalRecommendations.length,
        assessmentRecommendations.length,
        searchResults.length,
        searchQuery,
        t,
    ])

    const renderRecommendationBlock = (
        recommendations: JobRecommendation[],
        type: 'personal' | 'assessment' | 'search',
    ) => {
        const isSearchMode = type === 'search'
        const title = isSearchMode
            ? t('recommendations.search.title', { query: searchQuery })
            : type === 'personal'
              ? t('recommendations.personal.title')
              : t('recommendations.assessment.title')

        const description = isSearchMode
            ? t('recommendations.search.description', {
                  count: recommendations.length,
              })
            : type === 'personal'
              ? t('recommendations.personal.description')
              : t('recommendations.assessment.description')

        const icon = isSearchMode ? (
            <TbSearch />
        ) : type === 'personal' ? (
            <TbUser />
        ) : (
            <TbBrain />
        )

        return (
            <div key={type} className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                            {icon}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {description}
                            </p>
                        </div>
                    </div>
                    {type === 'personal' && onDebugSkills && (
                        <Button
                            size="sm"
                            variant="default"
                            onClick={onDebugSkills}
                            className="text-xs"
                        >
                            {t('debug.skills')}
                        </Button>
                    )}
                </div>

                {recommendations.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-gray-400 dark:text-gray-500 mb-2">
                            {type === 'search' ? (
                                <TbSearch className="w-12 h-12 mx-auto" />
                            ) : type === 'personal' ? (
                                <TbUser className="w-12 h-12 mx-auto" />
                            ) : (
                                <TbBrain className="w-12 h-12 mx-auto" />
                            )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                            {type === 'search'
                                ? t('recommendations.search.empty')
                                : type === 'personal'
                                  ? t('recommendations.personal.empty')
                                  : t('recommendations.assessment.empty')}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-stretch auto-rows-fr">
                        {recommendations.map((vacancy) => (
                            <VacancyCard
                                key={vacancy.id}
                                vacancy={vacancy}
                                onSave={onSave}
                                onApply={onApply}
                                onViewDetails={onViewDetails}
                            />
                        ))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header with search and actions */}
            <Card className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <TbSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder={t('search.placeholder')}
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onKeyDown={handleKeyDown}
                                className="pl-10 pr-10"
                            />
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <TbX className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {onFilter && (
                            <Button
                                variant="default"
                                size="sm"
                                onClick={onFilter}
                                icon={<TbFilter className="w-4 h-4" />}
                            >
                                {t('actions.filter')}
                            </Button>
                        )}
                        {onRefresh && (
                            <Button
                                variant="default"
                                size="sm"
                                onClick={onRefresh}
                                icon={<TbRefresh className="w-4 h-4" />}
                                disabled={isLoading}
                            >
                                {t('actions.refresh')}
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Results */}
            {isLoading ? (
                <Card className="p-8">
                    <div className="text-center">
                        <Spinner size={40} />
                        <p className="mt-4 text-gray-600 dark:text-gray-400">
                            {t('loading.text')}
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-6">
                    {tabs.length > 1 ? (
                        <Tabs
                            value={activeTab}
                            onChange={setActiveTab}
                            items={tabs}
                        />
                    ) : null}

                    {activeTab === 'personal' &&
                        hasPersonalRecommendations &&
                        renderRecommendationBlock(
                            personalRecommendations,
                            'personal',
                        )}

                    {activeTab === 'assessment' &&
                        hasAssessmentRecommendations &&
                        renderRecommendationBlock(
                            assessmentRecommendations,
                            'assessment',
                        )}

                    {activeTab === 'search' &&
                        hasSearchResults &&
                        renderRecommendationBlock(searchResults, 'search')}

                    {!hasPersonalRecommendations &&
                        !hasAssessmentRecommendations &&
                        !hasSearchResults && (
                            <Card className="p-8">
                                <div className="text-center">
                                    <div className="text-gray-400 dark:text-gray-500 mb-4">
                                        <TbTrendingUp className="w-16 h-16 mx-auto" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                        {t('empty.title')}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        {t('empty.description')}
                                    </p>
                                    {onRefresh && (
                                        <Button
                                            variant="solid"
                                            onClick={onRefresh}
                                            icon={
                                                <TbRefresh className="w-4 h-4" />
                                            }
                                        >
                                            {t('empty.tryAgain')}
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        )}
                </div>
            )}
        </div>
    )
}
