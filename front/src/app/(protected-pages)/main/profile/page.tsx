'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import {
    TbUser,
    TbBriefcase,
    TbSchool,
    TbMapPin,
    TbCurrencyTenge,
    TbStar,
    TbTrendingUp,
    TbTarget,
    TbBrain,
    TbSettings,
    TbAccessible,
    TbFileText,
    TbChartBar,
    TbCalendar,
    TbEdit,
} from 'react-icons/tb'
import ProfileService, {
    type FullUserProfile,
    type OnboardingProfile,
    type AssessmentResult,
} from '@/services/ProfileService'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl';

export default function ProfilePage() {
    const t = useTranslations();
    const router = useRouter()
    const [profileData, setProfileData] = useState<FullUserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadProfileData()
    }, [])

    const loadProfileData = async () => {
        try {
            setLoading(true)
            const data = await ProfileService.getFullProfile()
            setProfileData(data)
        } catch (err) {
            console.error('Error loading profile data:', err)
            setError(t('profile.error.loading'))
        } finally {
            setLoading(false)
        }
    }

    const formatSalary = (min?: number, max?: number, currency = 'KZT') => {
        if (!min && !max) return t('profile.salary.notSpecified')
        if (min && max)
            return `${min.toLocaleString()} - ${max.toLocaleString()} ${currency}`
        if (min) return `${t('profile.salary.from')} ${min.toLocaleString()} ${currency}`
        if (max) return `${t('profile.salary.upTo')} ${max.toLocaleString()} ${currency}`
        return t('profile.salary.notSpecified')
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    const getScoreColor = (score: number) => {
        if (score >= 4.5) return 'text-green-600 bg-green-50 border-green-200'
        if (score >= 3.5) return 'text-blue-600 bg-blue-50 border-blue-200'
        if (score >= 2.5)
            return 'text-yellow-600 bg-yellow-50 border-yellow-200'
        return 'text-red-600 bg-red-50 border-red-200'
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Spinner size={40} />
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={loadProfileData}>{t('profile.error.retry')}</Button>
            </div>
        )
    }

    const { onboarding_profile, assessment_results, profile_summary } =
        profileData || {}
    const latestAssessment = assessment_results?.[0] // Most recent assessment

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {t('profile.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('profile.subtitle')}
                    </p>
                </div>
                <Button
                    variant="solid"
                    className="flex items-center gap-2"
                    onClick={() => router.push('/onboarding')}
                >
                    <TbEdit className="w-4 h-4" />
                    {t('profile.edit')}
                </Button>
            </div>

            {/* Profile Summary */}
            {profile_summary && (
                <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                            <TbBrain className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                {t('profile.summary.title')}
                            </h3>
                            <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                                {profile_summary.summary_text}
                            </p>
                            <div className="flex items-center gap-4 mt-3 text-sm text-blue-600 dark:text-blue-300">
                                <span className="flex items-center gap-1">
                                    <TbCalendar className="w-4 h-4" />
                                    {t('profile.summary.updated')}:{' '}
                                    {formatDate(
                                        profile_summary.updated_at ||
                                            profile_summary.created_at,
                                    )}
                                </span>
                                {profile_summary.generated_from && (
                                    <span className="flex items-center gap-1">
                                        <TbTarget className="w-4 h-4" />
                                        {t('profile.summary.source')}:{' '}
                                        {profile_summary.generated_from ===
                                        'assessment'
                                            ? t('profile.summary.assessment')
                                            : t('profile.summary.onboarding')}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Assessment Results */}
            {latestAssessment && (
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <TbChartBar className="w-6 h-6 text-purple-600" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {t('profile.assessment.title')}
                            </h2>
                        </div>
                        {latestAssessment.overall_score && (
                            <div className="text-right">
                                <div className="text-3xl font-bold text-purple-600">
                                    {latestAssessment.overall_score.toFixed(1)}
                                    /5
                                </div>
                                <div className="text-sm text-gray-500">
                                    {t('profile.assessment.score')}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Strengths */}
                        <div>
                            <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-4 flex items-center gap-2">
                                <TbTrendingUp className="w-5 h-5" />
                                {t('profile.assessment.strengths')}
                            </h3>
                            <div className="space-y-3">
                                {latestAssessment.top_strengths.map(
                                    (strength, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                                        >
                                            <div>
                                                <div className="font-medium text-green-800 dark:text-green-200">
                                                    {strength.description}
                                                </div>
                                                <div className="text-sm text-green-600 dark:text-green-400 capitalize">
                                                    {strength.category.replace(
                                                        '_',
                                                        ' ',
                                                    )}
                                                </div>
                                            </div>
                                            <div
                                                className={`px-3 py-1 rounded-full text-sm font-semibold border ${getScoreColor(strength.score)}`}
                                            >
                                                {strength.score.toFixed(1)}
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>

                        {/* Areas for Improvement */}
                        <div>
                            <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-400 mb-4 flex items-center gap-2">
                                <TbTarget className="w-5 h-5" />
                                {t('profile.assessment.improvement')}
                            </h3>
                            <div className="space-y-3">
                                {latestAssessment.top_weaknesses.length > 0 ? (
                                    latestAssessment.top_weaknesses.map(
                                        (weakness, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg"
                                            >
                                                <div>
                                                    <div className="font-medium text-amber-800 dark:text-amber-200">
                                                        {weakness.description}
                                                    </div>
                                                    <div className="text-sm text-amber-600 dark:text-amber-400 capitalize">
                                                        {weakness.category.replace(
                                                            '_',
                                                            ' ',
                                                        )}
                                                    </div>
                                                </div>
                                                <div
                                                    className={`px-3 py-1 rounded-full text-sm font-semibold border ${getScoreColor(weakness.score)}`}
                                                >
                                                    {weakness.score.toFixed(1)}
                                                </div>
                                            </div>
                                        ),
                                    )
                                ) : (
                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                                        <p className="text-green-700 dark:text-green-300 font-medium">
                                            {t('profile.assessment.noImprovement')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* AI Analysis */}
                    {(latestAssessment.improvement_suggestions ||
                        latestAssessment.strengths_analysis) && (
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {latestAssessment.strengths_analysis && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                            {t('profile.assessment.strengthsAnalysis')}
                                        </h4>
                                        <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                                            {
                                                latestAssessment.strengths_analysis
                                            }
                                        </p>
                                    </div>
                                )}
                                {latestAssessment.improvement_suggestions && (
                                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                                        <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
                                            {t('profile.assessment.improvementSuggestions')}
                                        </h4>
                                        <p className="text-indigo-700 dark:text-indigo-300 text-sm leading-relaxed">
                                            {
                                                latestAssessment.improvement_suggestions
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="mt-4 text-xs text-gray-500 flex items-center justify-between">
                        <span>
                            {t('profile.assessment.testDate')}:{' '}
                            {formatDate(latestAssessment.created_at)}
                        </span>
                        {latestAssessment.confidence_level && (
                            <span>
                                {t('profile.assessment.confidenceLevel')}:{' '}
                                {(
                                    latestAssessment.confidence_level * 100
                                ).toFixed(0)}
                                %
                            </span>
                        )}
                    </div>
                </Card>
            )}

            {/* Onboarding Profile Data */}
            {onboarding_profile && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    {(onboarding_profile.first_name || onboarding_profile.last_name || onboarding_profile.phone || onboarding_profile.date_of_birth || onboarding_profile.gender) && (
                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <TbUser className="w-6 h-6 text-green-600" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    {t('profile.personal.title')}
                                </h2>
                            </div>
                            <div className="space-y-4">
                                {(onboarding_profile.first_name || onboarding_profile.last_name) && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {t('profile.personal.fullName')}
                                        </label>
                                        <p className="text-gray-900 dark:text-gray-100">
                                            {[onboarding_profile.first_name, onboarding_profile.last_name].filter(Boolean).join(' ')}
                                        </p>
                                    </div>
                                )}

                                {onboarding_profile.phone && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {t('profile.personal.phone')}
                                        </label>
                                        <p className="text-gray-900 dark:text-gray-100">
                                            {onboarding_profile.phone}
                                        </p>
                                    </div>
                                )}

                                {onboarding_profile.date_of_birth && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {t('profile.personal.dob')}
                                        </label>
                                        <p className="text-gray-900 dark:text-gray-100">
                                            {onboarding_profile.date_of_birth}
                                        </p>
                                    </div>
                                )}

                                {onboarding_profile.gender && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {t('profile.personal.gender')}
                                        </label>
                                        <p className="text-gray-900 dark:text-gray-100">
                                            {onboarding_profile.gender === 'male' ? t('profile.personal.male') : 
                                             onboarding_profile.gender === 'female' ? t('profile.personal.female') : 
                                             onboarding_profile.gender === 'other' ? t('profile.personal.other') : 
                                             onboarding_profile.gender === 'prefer_not_to_say' ? t('profile.personal.preferNotToSay') : 
                                             onboarding_profile.gender}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Professional Information */}
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <TbBriefcase className="w-6 h-6 text-blue-600" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {t('profile.professional.title')}
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {(onboarding_profile.profession || onboarding_profile.desired_field) && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {t('profile.professional.profession')}
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100">
                                        {onboarding_profile.profession || onboarding_profile.desired_field}
                                    </p>
                                </div>
                            )}

                            {onboarding_profile.industry && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {t('profile.professional.industry')}
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100">
                                        {onboarding_profile.industry}
                                    </p>
                                </div>
                            )}

                            {formatSalary(
                                onboarding_profile.min_salary,
                                onboarding_profile.max_salary,
                                onboarding_profile.currency,
                            ) !== t('profile.salary.notSpecified') && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {t('profile.professional.salaryExpectations')}
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100">
                                        {formatSalary(
                                            onboarding_profile.min_salary,
                                            onboarding_profile.max_salary,
                                            onboarding_profile.currency,
                                        )}
                                    </p>
                                </div>
                            )}

                            {onboarding_profile.skills &&
                                onboarding_profile.skills.length > 0 && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                                            {t('profile.professional.skills')}
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {onboarding_profile.skills.map(
                                                (skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                                                    >
                                                        {skill}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>
                    </Card>

                    {/* Work Preferences */}
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <TbSettings className="w-6 h-6 text-green-600" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {t('profile.preferences.title')}
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {t('profile.preferences.salaryExpectations')}
                                </label>
                                <p className="text-gray-900 dark:text-gray-100 font-medium flex items-center gap-2">
                                    <TbCurrencyTenge className="w-4 h-4" />
                                    {formatSalary(
                                        onboarding_profile.min_salary,
                                        onboarding_profile.max_salary,
                                        onboarding_profile.currency,
                                    )}
                                </p>
                            </div>

                            {onboarding_profile.work_format &&
                                onboarding_profile.work_format.length > 0 && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                                            {t('profile.preferences.workFormat')}
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {onboarding_profile.work_format.map(
                                                (format, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm rounded-full"
                                                    >
                                                        {format}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                            {onboarding_profile.employment_type &&
                                onboarding_profile.employment_type.length >
                                    0 && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                                            {t('profile.preferences.employmentType')}
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {onboarding_profile.employment_type.map(
                                                (type, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-sm rounded-full"
                                                    >
                                                        {type}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                            {onboarding_profile.preferred_cities &&
                                onboarding_profile.preferred_cities.length >
                                    0 && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                                            {t('profile.preferences.preferredCities')}
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {onboarding_profile.preferred_cities.map(
                                                (city, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-sm rounded-full flex items-center gap-1"
                                                    >
                                                        <TbMapPin className="w-3 h-3" />
                                                        {city}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>
                    </Card>

                    {/* Accessibility & Adaptations */}
                    {(onboarding_profile.accessibility_adaptations?.length ||
                        onboarding_profile.disability_type ||
                        onboarding_profile.workplace_preferences) && (
                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <TbAccessible className="w-6 h-6 text-purple-600" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    {t('profile.accessibility.title')}
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {onboarding_profile.disability_type && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {t('profile.accessibility.disabilityType')}
                                        </label>
                                        <p className="text-gray-900 dark:text-gray-100">
                                            {onboarding_profile.disability_type}
                                        </p>
                                    </div>
                                )}

                                {onboarding_profile.workplace_preferences && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {t('profile.accessibility.workplacePreferences')}
                                        </label>
                                        <p className="text-gray-900 dark:text-gray-100">
                                            {
                                                onboarding_profile.workplace_preferences
                                            }
                                        </p>
                                    </div>
                                )}

                                {onboarding_profile.accessibility_adaptations &&
                                    onboarding_profile.accessibility_adaptations
                                        .length > 0 && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                                                {t('profile.accessibility.adaptations')}
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {onboarding_profile.accessibility_adaptations.map(
                                                    (adaptation, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-sm rounded-full"
                                                        >
                                                            {adaptation}
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {onboarding_profile.accessibility_notes && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {t('profile.accessibility.notes')}
                                        </label>
                                        <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-sm">
                                            {
                                                onboarding_profile.accessibility_notes
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Personal Bio */}
                    {onboarding_profile.bio && (
                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <TbFileText className="w-6 h-6 text-indigo-600" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    {t('profile.bio.title')}
                                </h2>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                {onboarding_profile.bio}
                            </p>
                        </Card>
                    )}
                </div>
            )}

            {/* Empty State */}
            {!onboarding_profile && !latestAssessment && (
                <Card className="p-12 text-center">
                    <TbUser className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {t('profile.empty.title')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {t('profile.empty.description')}
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button
                            variant="solid"
                            onClick={() => router.push('/onboarding')}
                        >
                            {t('profile.empty.onboarding')}
                        </Button>
                        <Button
                            variant="default"
                            onClick={() => router.push('/main/assessment')}
                        >
                            {t('profile.empty.test')}
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    )
}
