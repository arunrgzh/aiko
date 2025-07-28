'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import {
    TbHeart,
    TbHeartFilled,
    TbExternalLink,
    TbSend,
    TbMapPin,
    TbCurrencyDollar,
    TbClock,
    TbBriefcase,
    TbTarget,
    TbBuilding,
    TbTrendingUp,
    TbStar,
} from 'react-icons/tb'
import type { JobRecommendation } from '../types'
import Link from 'next/link'

type VacancyCardProps = {
    vacancy: JobRecommendation
    onSave?: (id: number) => void
    onApply?: (id: number) => void
    onViewDetails?: (id: number) => void
}

export default function VacancyCard({
    vacancy,
    onSave,
    onApply,
    onViewDetails,
}: VacancyCardProps) {
    const t = useTranslations('vacancies')
    const isSaved = vacancy.is_saved || false

    const handleSave = () => {
        onSave?.(vacancy.id)
    }

    const formatSalary = () => {
        if (!vacancy.salary_from && !vacancy.salary_to) return null

        if (vacancy.salary_from && vacancy.salary_to) {
            return `${vacancy.salary_from.toLocaleString()} - ${vacancy.salary_to.toLocaleString()} ${vacancy.currency}`
        } else if (vacancy.salary_from) {
            return `${t('card.salary.from')} ${vacancy.salary_from.toLocaleString()} ${vacancy.currency}`
        } else if (vacancy.salary_to) {
            return `${t('card.salary.to')} ${vacancy.salary_to.toLocaleString()} ${vacancy.currency}`
        }
    }

    const getRelevanceColor = (score: number) => {
        if (score >= 0.8) return 'text-green-600 dark:text-green-400'
        if (score >= 0.6) return 'text-yellow-600 dark:text-yellow-400'
        return 'text-gray-600 dark:text-gray-400'
    }

    const getRelevanceLabel = (score: number) => {
        if (score >= 0.8) return t('card.relevance.excellent')
        if (score >= 0.6) return t('card.relevance.good')
        return t('card.relevance.fair')
    }

    const timeAgo = () => {
        const now = new Date()
        const created = new Date(vacancy.created_at)
        const diffInHours = Math.floor(
            (now.getTime() - created.getTime()) / (1000 * 60 * 60),
        )

        if (diffInHours < 1) return t('card.timeAgo.justNow')
        if (diffInHours < 24)
            return t('card.timeAgo.hoursAgo', { count: diffInHours })

        const diffInDays = Math.floor(diffInHours / 24)
        if (diffInDays < 7)
            return t('card.timeAgo.daysAgo', { count: diffInDays })

        return created.toLocaleDateString()
    }

    return (
        <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 hover:border-l-blue-600">
            <div className="p-6 space-y-4">
                {/* Header with save button */}
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-blue-600 transition-colors">
                            {vacancy.title}
                        </h3>
                        {vacancy.company_name && (
                            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                                <TbBuilding className="w-4 h-4 mr-1" />
                                <span className="text-sm">
                                    {vacancy.company_name}
                                </span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSave}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label={
                            isSaved
                                ? t('card.actions.saved')
                                : t('card.actions.save')
                        }
                    >
                        {isSaved ? (
                            <TbHeartFilled className="w-5 h-5 text-red-500" />
                        ) : (
                            <TbHeart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                        )}
                    </button>
                </div>

                {/* Key info badges */}
                <div className="flex flex-wrap gap-2">
                    {/* Relevance Score */}
                    <Badge
                        className={`${getRelevanceColor(vacancy.relevance_score)} bg-opacity-10`}
                    >
                        <TbTarget className="w-3 h-3 mr-1" />
                        {getRelevanceLabel(vacancy.relevance_score)}
                    </Badge>

                    {/* Location */}
                    {vacancy.area_name && (
                        <Badge
                            variant="outline"
                            className="text-gray-600 dark:text-gray-400"
                        >
                            <TbMapPin className="w-3 h-3 mr-1" />
                            {vacancy.area_name}
                        </Badge>
                    )}

                    {/* Employment Type */}
                    {vacancy.employment_type && (
                        <Badge
                            variant="outline"
                            className="text-gray-600 dark:text-gray-400"
                        >
                            <TbBriefcase className="w-3 h-3 mr-1" />
                            {vacancy.employment_type}
                        </Badge>
                    )}

                    {/* Experience */}
                    {vacancy.experience_required && (
                        <Badge
                            variant="outline"
                            className="text-gray-600 dark:text-gray-400"
                        >
                            <TbTrendingUp className="w-3 h-3 mr-1" />
                            {vacancy.experience_required}
                        </Badge>
                    )}
                </div>

                {/* Salary */}
                {formatSalary() && (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                        <TbCurrencyDollar className="w-4 h-4 mr-1" />
                        <span className="font-medium">{formatSalary()}</span>
                    </div>
                )}

                {/* Description preview */}
                {vacancy.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                        {vacancy.description}
                    </p>
                )}

                {/* Skills tags */}
                {vacancy.key_skills && vacancy.key_skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {vacancy.key_skills.slice(0, 5).map((skill, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
                            >
                                {skill}
                            </span>
                        ))}
                        {vacancy.key_skills.length > 5 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                                +{vacancy.key_skills.length - 5}
                            </span>
                        )}
                    </div>
                )}

                {/* Time and source info */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center">
                        <TbClock className="w-3 h-3 mr-1" />
                        <span>{timeAgo()}</span>
                    </div>

                    {vacancy.recommendation_source && (
                        <div className="flex items-center">
                            <TbStar className="w-3 h-3 mr-1" />
                            <span>{vacancy.recommendation_source}</span>
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 pt-4">
                    <Button
                        size="sm"
                        variant="solid"
                        onClick={() => onApply?.(vacancy.id)}
                        className="flex-1"
                        icon={<TbSend />}
                    >
                        {t('card.actions.apply')}
                    </Button>

                    <Button
                        size="sm"
                        variant="plain"
                        onClick={() => onViewDetails?.(vacancy.id)}
                        icon={<TbExternalLink />}
                    >
                        {t('card.actions.viewDetails')}
                    </Button>
                </div>

                {/* Detailed scores - for debugging/development */}
                {vacancy.detailed_scores &&
                    Object.keys(vacancy.detailed_scores).length > 0 && (
                        <details className="mt-4">
                            <summary className="text-xs text-gray-500 cursor-pointer">
                                Detailed matching scores
                            </summary>
                            <div className="mt-2 space-y-1">
                                {Object.entries(vacancy.detailed_scores).map(
                                    ([key, value]) => (
                                        <div
                                            key={key}
                                            className="flex justify-between text-xs"
                                        >
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {key}:
                                            </span>
                                            <span className="text-gray-800 dark:text-gray-200">
                                                {typeof value === 'number'
                                                    ? value.toFixed(2)
                                                    : value}
                                            </span>
                                        </div>
                                    ),
                                )}
                            </div>
                        </details>
                    )}
            </div>
        </Card>
    )
}
