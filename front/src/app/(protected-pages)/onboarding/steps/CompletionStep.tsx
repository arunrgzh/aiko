'use client'

import { useState } from 'react'
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
        linkedin_url: data.linkedin_url || '',
        portfolio_url: data.portfolio_url || '',
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleComplete = () => {
        onUpdate(formData)
        onComplete()
    }

    const handlePrevious = () => {
        onUpdate(formData)
        onPrevious()
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Почти готово!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Добавьте финальные детали для завершения вашего профиля
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <Form layout="vertical">
                    <FormItem label="Bio">
                        <textarea
                            rows={4}
                            value={formData.bio}
                            onChange={(e) =>
                                handleInputChange('bio', e.target.value)
                            }
                            placeholder="Расскажите немного о себе, ваших интересах и том, что вы ищете..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </FormItem>

                    <FormItem label="LinkedIn Profile">
                        <Input
                            value={formData.linkedin_url}
                            onChange={(e) =>
                                handleInputChange(
                                    'linkedin_url',
                                    e.target.value,
                                )
                            }
                            placeholder="https://linkedin.com/in/ваш-профиль"
                        />
                    </FormItem>

                    <FormItem label="Portfolio Website">
                        <Input
                            value={formData.portfolio_url}
                            onChange={(e) =>
                                handleInputChange(
                                    'portfolio_url',
                                    e.target.value,
                                )
                            }
                            placeholder="https://ваш-портфолио.com"
                        />
                    </FormItem>
                </Form>

                {/* Summary */}
                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Краткое резюме профиля
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div>
                            <span className="font-medium">Имя:</span>{' '}
                            {data.first_name} {data.last_name}
                        </div>
                        {data.current_position && (
                            <div>
                                <span className="font-medium">Должность:</span>{' '}
                                {data.current_position}
                            </div>
                        )}
                        {data.skills && data.skills.length > 0 && (
                            <div>
                                <span className="font-medium">Навыки:</span>{' '}
                                {data.skills.slice(0, 5).join(', ')}
                                {data.skills.length > 5 &&
                                    ` +${data.skills.length - 5} еще`}
                            </div>
                        )}
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
                    </div>
                </div>

                <div className="flex justify-between mt-8">
                    <Button
                        variant="default"
                        onClick={handlePrevious}
                        disabled={saving}
                        className="min-w-[120px]"
                    >
                        Назад
                    </Button>
                    <Button
                        variant="solid"
                        onClick={handleComplete}
                        disabled={saving}
                        className="min-w-[120px]"
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
    )
}

export default CompletionStep
