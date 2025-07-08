'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import {
    TbHeart,
    TbHeartFilled,
    TbExternalLink,
    TbMapPin,
    TbCalendar,
    TbClock,
    TbBriefcase,
    TbCurrencyTenge,
    TbTarget,
    TbStar,
    TbInfoCircle,
} from 'react-icons/tb'
import { JobRecommendation } from '../types'

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
    const [isSaved, setIsSaved] = useState(vacancy.is_saved || false)

    const handleSave = () => {
        setIsSaved(!isSaved)
        onSave?.(vacancy.id)
    }

    const formatSalary = () => {
        if (!vacancy.salary_from && !vacancy.salary_to) return null

        if (vacancy.salary_from && vacancy.salary_to) {
            return `${vacancy.salary_from.toLocaleString()} - ${vacancy.salary_to.toLocaleString()} ${vacancy.currency}`
        } else if (vacancy.salary_from) {
            return `от ${vacancy.salary_from.toLocaleString()} ${vacancy.currency}`
        } else if (vacancy.salary_to) {
            return `до ${vacancy.salary_to.toLocaleString()} ${vacancy.currency}`
        }
    }

    const getRelevanceColor = (score: number) => {
        if (score >= 0.8) return 'text-green-600 dark:text-green-400'
        if (score >= 0.6) return 'text-yellow-600 dark:text-yellow-400'
        return 'text-gray-600 dark:text-gray-400'
    }

    const getRelevanceLabel = (score: number) => {
        if (score >= 0.8) return 'Отлично подходит'
        if (score >= 0.6) return 'Хорошо подходит'
        return 'Может подойти'
    }

    const timeAgo = () => {
        const now = new Date()
        const created = new Date(vacancy.created_at)
        const diffInHours = Math.floor(
            (now.getTime() - created.getTime()) / (1000 * 60 * 60),
        )

        if (diffInHours < 1) return 'Только что'
        if (diffInHours < 24) return `${diffInHours} ч. назад`

        const diffInDays = Math.floor(diffInHours / 24)
        if (diffInDays < 7) return `${diffInDays} дн. назад`

        return created.toLocaleDateString('ru-RU')
    }

    return (
        <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <Avatar
                            className="shrink-0"
                            size="md"
                            shape="square"
                            src={vacancy.raw_data?.employer?.logo_urls?.['90']}
                        >
                            {vacancy.company_name?.charAt(0).toUpperCase() ||
                                'К'}
                        </Avatar>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
                                {vacancy.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {vacancy.company_name}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                        <Button
                            size="sm"
                            variant="plain"
                            shape="circle"
                            onClick={handleSave}
                            className="text-gray-400 hover:text-red-500"
                        >
                            {isSaved ? (
                                <TbHeartFilled className="text-red-500" />
                            ) : (
                                <TbHeart />
                            )}
                        </Button>
                        <div className="flex items-center space-x-1">
                            <TbTarget
                                className={`text-sm ${getRelevanceColor(vacancy.relevance_score)}`}
                            />
                            <span
                                className={`text-xs font-medium ${getRelevanceColor(vacancy.relevance_score)}`}
                            >
                                {Math.round(vacancy.relevance_score * 100)}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Relevance Badge */}
                <div className="mb-4">
                    <Badge
                        className={`${
                            vacancy.relevance_score >= 0.8
                                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                : vacancy.relevance_score >= 0.6
                                  ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        } text-xs`}
                    >
                        <TbStar className="mr-1" />
                        {getRelevanceLabel(vacancy.relevance_score)}
                    </Badge>
                </div>

                {/* Job Details */}
                <div className="space-y-3 mb-4">
                    {/* Salary */}
                    {formatSalary() && (
                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                            <TbCurrencyTenge className="mr-2 text-green-600 dark:text-green-400" />
                            <span className="font-medium">
                                {formatSalary()}
                            </span>
                        </div>
                    )}

                    {/* Location */}
                    {vacancy.area_name && (
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <TbMapPin className="mr-2" />
                            <span>{vacancy.area_name}</span>
                        </div>
                    )}

                    {/* Employment Type & Experience */}
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        {vacancy.employment_type && (
                            <div className="flex items-center">
                                <TbBriefcase className="mr-1" />
                                <span>{vacancy.employment_type}</span>
                            </div>
                        )}
                        {vacancy.experience_required && (
                            <div className="flex items-center">
                                <TbClock className="mr-1" />
                                <span>{vacancy.experience_required}</span>
                            </div>
                        )}
                    </div>

                    {/* Posted Date */}
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
                        <TbCalendar className="mr-1" />
                        <span>{timeAgo()}</span>
                    </div>
                </div>

                {/* Skills */}
                {vacancy.key_skills && vacancy.key_skills.length > 0 && (
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                            {vacancy.key_skills
                                .slice(0, 5)
                                .map((skill, index) => (
                                    <Badge
                                        key={index}
                                        className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            {vacancy.key_skills.length > 5 && (
                                <Badge className="text-xs bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                    +{vacancy.key_skills.length - 5} еще
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {/* Description Preview */}
                {vacancy.description && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                            {vacancy.description}
                        </p>
                    </div>
                )}

                {/* Match Scores */}
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                            Совпадение навыков
                        </span>
                        <span className="font-medium">
                            {Math.round(vacancy.skills_match_score * 100)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                        <div
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                            style={{
                                width: `${vacancy.skills_match_score * 100}%`,
                            }}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Button
                            size="sm"
                            variant="solid"
                            onClick={() => onApply?.(vacancy.id)}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                            Откликнуться
                        </Button>
                        <Button
                            size="sm"
                            variant="plain"
                            onClick={() => onViewDetails?.(vacancy.id)}
                        >
                            <TbInfoCircle className="mr-1" />
                            Подробнее
                        </Button>
                    </div>

                    {vacancy.raw_data?.alternate_url && (
                        <Button
                            size="sm"
                            variant="plain"
                            onClick={() =>
                                window.open(
                                    vacancy.raw_data?.alternate_url,
                                    '_blank',
                                )
                            }
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <TbExternalLink />
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    )
}
