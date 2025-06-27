'use client'

import { useState } from 'react'
import { Form, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { OnboardingData } from '../page'

interface PreferencesStepProps {
    data: OnboardingData
    onUpdate: (data: Partial<OnboardingData>) => void
    onNext: () => void
    onPrevious: () => void
}

const PreferencesStep = ({
    data,
    onUpdate,
    onNext,
    onPrevious,
}: PreferencesStepProps) => {
    const [formData, setFormData] = useState({
        job_features: data.job_features || [],
        suitable_job_categories: data.suitable_job_categories || [],
    })

    const [newJobType, setNewJobType] = useState('')
    const [newLocation, setNewLocation] = useState('')

    const popularJobTypes = [
        'Полная занятость',
        'Частичная занятость',
        'Контракт',
        'Фриланс',
        'Стажировка',
        'Удаленная работа',
        'Гибридная работа',
        'В офисе',
    ]

    const popularLocations = [
        'Алматы',
        'Астана',
        'Шымкент',
        'Актобе',
        'Караганда',
        'Тараз',
        'Павлодар',
        'Усть-Каменогорск',
        'Семей',
        'Уральск',
        'Удаленная работа',
        'Любое место',
    ]

    const handleAddJobType = () => {
        if (
            newJobType.trim() &&
            !formData.job_features.includes(newJobType.trim())
        ) {
            setFormData((prev) => ({
                ...prev,
                job_features: [...prev.job_features, newJobType.trim()],
            }))
            setNewJobType('')
        }
    }

    const handleRemoveJobType = (jobType: string) => {
        setFormData((prev) => ({
            ...prev,
            job_features: prev.job_features.filter((type) => type !== jobType),
        }))
    }

    const handleAddLocation = () => {
        if (
            newLocation.trim() &&
            !formData.suitable_job_categories.includes(newLocation.trim())
        ) {
            setFormData((prev) => ({
                ...prev,
                suitable_job_categories: [
                    ...prev.suitable_job_categories,
                    newLocation.trim(),
                ],
            }))
            setNewLocation('')
        }
    }

    const handleRemoveLocation = (location: string) => {
        setFormData((prev) => ({
            ...prev,
            suitable_job_categories: prev.suitable_job_categories.filter(
                (loc) => loc !== location,
            ),
        }))
    }

    const handleAddPopularJobType = (jobType: string) => {
        if (!formData.job_features.includes(jobType)) {
            setFormData((prev) => ({
                ...prev,
                job_features: [...prev.job_features, jobType],
            }))
        }
    }

    const handleAddPopularLocation = (location: string) => {
        if (!formData.suitable_job_categories.includes(location)) {
            setFormData((prev) => ({
                ...prev,
                suitable_job_categories: [
                    ...prev.suitable_job_categories,
                    location,
                ],
            }))
        }
    }

    const handleNext = () => {
        onUpdate({
            job_features: formData.job_features,
            suitable_job_categories: formData.suitable_job_categories,
        })
        onNext()
    }

    const handlePrevious = () => {
        onUpdate({
            job_features: formData.job_features,
            suitable_job_categories: formData.suitable_job_categories,
        })
        onPrevious()
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Предпочтения по работе
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Расскажите о ваших предпочтениях по работе и желаемых местах
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <Form layout="vertical">
                    {/* Job Types */}
                    <FormItem label="Preferred Job Types">
                        <div className="flex gap-2 mb-4">
                            <Input
                                value={newJobType}
                                onChange={(e) => setNewJobType(e.target.value)}
                                placeholder="Добавить тип работы"
                                className="flex-1"
                            />
                            <Button
                                variant="solid"
                                onClick={handleAddJobType}
                                disabled={!newJobType.trim()}
                            >
                                Добавить
                            </Button>
                        </div>

                        {formData.job_features.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {formData.job_features.map((jobType, index) => (
                                    <div
                                        key={index}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                                    >
                                        <span>{jobType}</span>
                                        <button
                                            onClick={() =>
                                                handleRemoveJobType(jobType)
                                            }
                                            className="ml-1 text-green-600 hover:text-green-800"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {popularJobTypes.map((jobType) => (
                                <Button
                                    key={jobType}
                                    size="sm"
                                    variant={
                                        formData.job_features.includes(jobType)
                                            ? 'solid'
                                            : 'default'
                                    }
                                    onClick={() =>
                                        handleAddPopularJobType(jobType)
                                    }
                                    disabled={formData.job_features.includes(
                                        jobType,
                                    )}
                                >
                                    {jobType}
                                </Button>
                            ))}
                        </div>
                    </FormItem>

                    {/* Locations */}
                    <FormItem label="Preferred Locations">
                        <div className="flex gap-2 mb-4">
                            <Input
                                value={newLocation}
                                onChange={(e) => setNewLocation(e.target.value)}
                                placeholder="Добавить место"
                                className="flex-1"
                            />
                            <Button
                                variant="solid"
                                onClick={handleAddLocation}
                                disabled={!newLocation.trim()}
                            >
                                Добавить
                            </Button>
                        </div>

                        {formData.suitable_job_categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {formData.suitable_job_categories.map(
                                    (location, index) => (
                                        <div
                                            key={index}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                                        >
                                            <span>{location}</span>
                                            <button
                                                onClick={() =>
                                                    handleRemoveLocation(
                                                        location,
                                                    )
                                                }
                                                className="ml-1 text-purple-600 hover:text-purple-800"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ),
                                )}
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {popularLocations.map((location) => (
                                <Button
                                    key={location}
                                    size="sm"
                                    variant={
                                        formData.suitable_job_categories.includes(
                                            location,
                                        )
                                            ? 'solid'
                                            : 'default'
                                    }
                                    onClick={() =>
                                        handleAddPopularLocation(location)
                                    }
                                    disabled={formData.suitable_job_categories.includes(
                                        location,
                                    )}
                                >
                                    {location}
                                </Button>
                            ))}
                        </div>
                    </FormItem>
                </Form>

                <div className="flex justify-between mt-8">
                    <Button
                        variant="default"
                        onClick={handlePrevious}
                        className="min-w-[120px]"
                    >
                        Назад
                    </Button>
                    <Button
                        variant="solid"
                        onClick={handleNext}
                        className="min-w-[120px]"
                    >
                        Далее
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default PreferencesStep
