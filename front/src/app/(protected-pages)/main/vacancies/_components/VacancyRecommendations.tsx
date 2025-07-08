'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Tabs from '@/components/ui/Tabs'
import Badge from '@/components/ui/Badge'
import {
    TbUser,
    TbBrain,
    TbRefresh,
    TbFilter,
    TbSearch,
    TbTrendingUp,
    TbHeart,
} from 'react-icons/tb'
import VacancyCard from './VacancyCard'
import { JobRecommendation } from '../types'

type VacancyRecommendationsProps = {
    personalRecommendations: JobRecommendation[]
    assessmentRecommendations: JobRecommendation[]
    onRefresh?: () => void
    onFilter?: () => void
    onSearch?: (query: string) => void
    onSave?: (id: number) => void
    onApply?: (id: number) => void
    onViewDetails?: (id: number) => void
    onDebugSkills?: () => void
    isLoading?: boolean
}

export default function VacancyRecommendations({
    personalRecommendations,
    assessmentRecommendations,
    onRefresh,
    onFilter,
    onSearch,
    onSave,
    onApply,
    onViewDetails,
    onDebugSkills,
    isLoading = false,
}: VacancyRecommendationsProps) {
    const [activeTab, setActiveTab] = useState('personal')
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch?.(searchQuery)
    }

    const renderRecommendationBlock = (
        recommendations: JobRecommendation[],
        type: 'personal' | 'assessment',
    ) => {
        const title =
            type === 'personal'
                ? 'Персональные рекомендации'
                : 'На основе тестирования'

        const description =
            type === 'personal'
                ? 'Вакансии, подобранные на основе ваших навыков и предпочтений'
                : 'Рекомендации на основе результатов профессионального тестирования'

        const icon = type === 'personal' ? <TbUser /> : <TbBrain />

        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div
                            className={`p-2 rounded-lg ${
                                type === 'personal'
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
                    <div className="flex items-center space-x-2">
                        <Badge
                            className={`${
                                type === 'personal'
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                    : 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                            }`}
                        >
                            {recommendations.length} вакансий
                        </Badge>
                    </div>
                </div>

                {/* Recommendations Grid */}
                {recommendations.length > 0 ? (
                    <div className="space-y-4">
                        {recommendations.map((vacancy) => (
                            <VacancyCard
                                key={`${type}-${vacancy.id}`}
                                vacancy={vacancy}
                                onSave={onSave}
                                onApply={onApply}
                                onViewDetails={onViewDetails}
                            />
                        ))}
                    </div>
                ) : (
                    <Card className="p-8 text-center">
                        <div
                            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                                type === 'personal'
                                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                            }`}
                        >
                            {icon}
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            Рекомендации не найдены
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {type === 'personal'
                                ? 'Попробуйте обновить свой профиль или расширить критерии поиска'
                                : 'Пройдите профессиональное тестирование для получения рекомендаций'}
                        </p>
                        <Button
                            variant="plain"
                            onClick={onRefresh}
                            icon={<TbRefresh />}
                        >
                            Обновить рекомендации
                        </Button>
                    </Card>
                )}
            </div>
        )
    }

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
                    <form onSubmit={handleSearch} className="flex">
                        <div className="relative">
                            <TbSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Поиск по вакансиям..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </form>

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
                        loading={isLoading}
                        icon={<TbRefresh />}
                    >
                        Обновить
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
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
                                Сохранено
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recommendations Tabs */}
            <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.TabList className="border-b border-gray-200 dark:border-gray-700">
                    <Tabs.TabNav value="personal" icon={<TbUser />}>
                        Персональные ({personalRecommendations.length})
                    </Tabs.TabNav>
                    <Tabs.TabNav value="assessment" icon={<TbBrain />}>
                        По тестированию ({assessmentRecommendations.length})
                    </Tabs.TabNav>
                </Tabs.TabList>

                <div className="mt-6">
                    <Tabs.TabContent value="personal">
                        {renderRecommendationBlock(
                            personalRecommendations,
                            'personal',
                        )}
                    </Tabs.TabContent>

                    <Tabs.TabContent value="assessment">
                        {renderRecommendationBlock(
                            assessmentRecommendations,
                            'assessment',
                        )}
                    </Tabs.TabContent>
                </div>
            </Tabs>
        </div>
    )
}
