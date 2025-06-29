'use client'

import { useState, useEffect } from 'react'
import { Form, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { OnboardingData } from '../page'

interface CompletionStepProps {
    data: OnboardingData
    onUpdate: (data: Partial<OnboardingData>) => void
    onComplete: () => void
    onPrevious: () => void
    saving: boolean
}

const CompletionStep = ({
    data,
    onUpdate,
    onComplete,
    onPrevious,
    saving,
}: CompletionStepProps) => {
    const [formData, setFormData] = useState({
        bio: data.bio || '',
    })

    const [savedFields, setSavedFields] = useState<Record<string, boolean>>({})

    // Синхронизируем с родительским компонентом через useEffect
    useEffect(() => {
        const timeout = setTimeout(() => {
            onUpdate(formData)
        }, 0)
        return () => clearTimeout(timeout)
    }, [formData])

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleComplete = () => {
        onComplete()
    }

    const handleSave = () => {
        // Data is already saved in real-time, just provide feedback
        // Optional: Add toast notification or feedback that data was saved
    }

    const handlePrevious = () => {
        onPrevious()
    }

    const handleSaveField = (fieldName: string) => {
        setSavedFields((prev) => ({ ...prev, [fieldName]: true }))
        setTimeout(() => {
            setSavedFields((prev) => ({ ...prev, [fieldName]: false }))
        }, 2000)
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Почти готово!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Добавьте краткое описание о себе для завершения профиля
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <Form layout="vertical">
                    <FormItem label="Расскажите о себе">
                        <div className="space-y-2">
                            <textarea
                                rows={4}
                                value={formData.bio}
                                onChange={(e) =>
                                    handleInputChange('bio', e.target.value)
                                }
                                placeholder="Расскажите немного о себе, ваших интересах и том, что вы ищете..."
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant={
                                        savedFields.bio ? 'solid' : 'default'
                                    }
                                    onClick={() => handleSaveField('bio')}
                                    className="min-w-[80px]"
                                >
                                    {savedFields.bio
                                        ? '✓ Сохранено'
                                        : 'Сохранить'}
                                </Button>
                            </div>
                        </div>
                    </FormItem>
                </Form>

                {/* Summary */}
                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Краткое резюме профиля
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        {/* Личная информация */}
                        <div>
                            <span className="font-medium">Имя:</span>{' '}
                            {data.first_name || 'не указано'}{' '}
                            {data.last_name || ''}
                        </div>
                        {data.phone && (
                            <div>
                                <span className="font-medium">Телефон:</span>{' '}
                                {data.phone}
                            </div>
                        )}
                        {data.date_of_birth && (
                            <div>
                                <span className="font-medium">
                                    Дата рождения:
                                </span>{' '}
                                {data.date_of_birth}
                            </div>
                        )}
                        {data.gender && (
                            <div>
                                <span className="font-medium">Пол:</span>{' '}
                                {data.gender}
                            </div>
                        )}

                        {/* Профессиональная информация */}
                        {data.current_position && (
                            <div>
                                <span className="font-medium">Должность:</span>{' '}
                                {data.current_position}
                            </div>
                        )}
                        {data.years_of_experience !== undefined && (
                            <div>
                                <span className="font-medium">
                                    Опыт работы:
                                </span>{' '}
                                {data.years_of_experience === 0
                                    ? 'Нет опыта'
                                    : data.years_of_experience === 1
                                      ? 'Менее 1 года'
                                      : data.years_of_experience === 2
                                        ? '1-2 года'
                                        : data.years_of_experience === 3
                                          ? '3-5 лет'
                                          : data.years_of_experience === 5
                                            ? '5-10 лет'
                                            : 'Более 10 лет'}
                            </div>
                        )}
                        {data.industry && (
                            <div>
                                <span className="font-medium">Отрасль:</span>{' '}
                                {data.industry}
                            </div>
                        )}
                        {data.education_status && (
                            <div>
                                <span className="font-medium">
                                    Образование:
                                </span>{' '}
                                {data.education_status}
                            </div>
                        )}

                        {/* Навыки */}
                        {data.skills && data.skills.length > 0 && (
                            <div>
                                <span className="font-medium">Навыки:</span>{' '}
                                {data.skills.slice(0, 5).join(', ')}
                                {data.skills.length > 5 &&
                                    ` +${data.skills.length - 5} еще`}
                            </div>
                        )}

                        {/* Предпочтения по работе */}
                        {data.preferred_job_types &&
                            data.preferred_job_types.length > 0 && (
                                <div>
                                    <span className="font-medium">
                                        Типы работ:
                                    </span>{' '}
                                    {data.preferred_job_types.join(', ')}
                                </div>
                            )}
                        {data.preferred_locations &&
                            data.preferred_locations.length > 0 && (
                                <div>
                                    <span className="font-medium">Места:</span>{' '}
                                    {data.preferred_locations.join(', ')}
                                </div>
                            )}

                        {/* Условия работы */}
                        {data.work_conditions &&
                            data.work_conditions.length > 0 && (
                                <div>
                                    <span className="font-medium">
                                        Условия работы:
                                    </span>{' '}
                                    {data.work_conditions.join(', ')}
                                </div>
                            )}

                        {/* Доступность */}
                        {data.preferred_work_time && (
                            <div>
                                <span className="font-medium">
                                    Предпочитаемое время работы:
                                </span>{' '}
                                {data.preferred_work_time}
                            </div>
                        )}
                        {data.important_adaptations &&
                            data.important_adaptations.length > 0 && (
                                <div>
                                    <span className="font-medium">
                                        Важные адаптации:
                                    </span>{' '}
                                    {data.important_adaptations
                                        .slice(0, 3)
                                        .join(', ')}
                                    {data.important_adaptations.length > 3 &&
                                        ` +${data.important_adaptations.length - 3} еще`}
                                </div>
                            )}

                        {/* Дополнительные описания */}
                        {data.disability_description && (
                            <div>
                                <span className="font-medium">
                                    Описание инвалидности:
                                </span>{' '}
                                {data.disability_description}
                            </div>
                        )}
                        {data.workplace_other && (
                            <div>
                                <span className="font-medium">
                                    Другие предпочтения места работы:
                                </span>{' '}
                                {data.workplace_other}
                            </div>
                        )}
                        {data.adaptations_other && (
                            <div>
                                <span className="font-medium">
                                    Другие адаптации:
                                </span>{' '}
                                {data.adaptations_other}
                            </div>
                        )}
                        {data.platform_features_other && (
                            <div>
                                <span className="font-medium">
                                    Другие функции платформы:
                                </span>{' '}
                                {data.platform_features_other}
                            </div>
                        )}
                        {data.feedback && (
                            <div>
                                <span className="font-medium">
                                    Дополнительные комментарии:
                                </span>{' '}
                                {data.feedback}
                            </div>
                        )}
                        {data.bio && (
                            <div>
                                <span className="font-medium">О себе:</span>{' '}
                                {data.bio}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-between items-center mt-8">
                    <Button
                        variant="default"
                        onClick={handlePrevious}
                        disabled={saving}
                        className="min-w-[120px]"
                    >
                        Назад
                    </Button>

                    <div className="flex gap-3">
                        <Button
                            variant="default"
                            onClick={handleSave}
                            disabled={saving}
                            className="min-w-[120px]"
                        >
                            Сохранить
                        </Button>
                        <Button
                            variant="solid"
                            onClick={handleComplete}
                            disabled={saving}
                            className="min-w-[140px]"
                        >
                            {saving ? (
                                <>
                                    <Spinner size={16} className="mr-2" />
                                    Сохранение...
                                </>
                            ) : (
                                'Завершить настройку'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompletionStep
