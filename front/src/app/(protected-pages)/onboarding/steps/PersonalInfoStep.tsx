'use client'

import { useState } from 'react'
import { Form, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { OnboardingData } from '../page'

interface Option {
    value: string
    label: string
}

interface PersonalInfoStepProps {
    data: OnboardingData
    onUpdate: (data: Partial<OnboardingData>) => void
    onNext: () => void
}

const PersonalInfoStep = ({
    data,
    onUpdate,
    onNext,
}: PersonalInfoStepProps) => {
    const [formData, setFormData] = useState({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        phone: data.phone || '',
        date_of_birth: data.date_of_birth || '',
        gender: data.gender || '',
        disability_type: data.disability_type || [],
        disability_description: data.disability_description || '',
        work_conditions: data.work_conditions || [],
        workplace_preferences: data.workplace_preferences || [],
        workplace_other: data.workplace_other || '',
    })

    const genderOptions: Option[] = [
        { value: 'male', label: 'Мужской' },
        { value: 'female', label: 'Женский' },
        { value: 'other', label: 'Другое' },
        { value: 'prefer_not_to_say', label: 'Предпочитаю не указывать' },
    ]

    const disabilityTypeOptions = [
        'Нарушение зрения',
        'Нарушение слуха',
        'Нарушение опорно-двигательного аппарата',
        'Нарушение речи',
        'Когнитивные нарушения',
        'Психические расстройства',
        'Хронические заболевания',
        'Другое',
        'Нет инвалидности',
    ]

    const workConditionOptions = [
        'Могу работать полный день',
        'Могу работать неполный день',
        'Нужен гибкий график',
        'Могу работать удаленно',
        'Нужна помощь на рабочем месте',
        'Нужны специальные условия',
        'Другое',
    ]

    const workplacePreferenceOptions = [
        'Офис',
        'Удаленная работа',
        'Гибридная работа',
        'Домашняя работа',
        'Специально оборудованное место',
        'Другое',
    ]

    const handleInputChange = (field: string, value: string | string[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleToggleArray = (field: string, value: string) => {
        setFormData((prev) => {
            const currentArray = prev[field as keyof typeof prev] as string[]
            const updatedArray = currentArray.includes(value)
                ? currentArray.filter((item) => item !== value)
                : [...currentArray, value]
            return { ...prev, [field]: updatedArray }
        })
    }

    const handleNext = () => {
        onUpdate(formData)
        onNext()
    }

    const isFormValid = formData.first_name && formData.last_name

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Личная информация
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Расскажите о себе и ваших потребностях
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <Form layout="vertical">
                    {/* Basic Information */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Основная информация
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormItem label="Имя *">
                                <Input
                                    value={formData.first_name}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'first_name',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Имя"
                                />
                            </FormItem>

                            <FormItem label="Фамилия *">
                                <Input
                                    value={formData.last_name}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'last_name',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Фамилия"
                                />
                            </FormItem>
                        </div>

                        <FormItem label="Телефон">
                            <Input
                                value={formData.phone}
                                onChange={(e) =>
                                    handleInputChange('phone', e.target.value)
                                }
                                placeholder="Телефон"
                            />
                        </FormItem>

                        <FormItem label="Дата рождения">
                            <Input
                                type="date"
                                value={formData.date_of_birth}
                                onChange={(e) =>
                                    handleInputChange(
                                        'date_of_birth',
                                        e.target.value,
                                    )
                                }
                            />
                        </FormItem>

                        <FormItem label="Пол">
                            <Select<Option>
                                value={genderOptions.find(
                                    (option) =>
                                        option.value === formData.gender,
                                )}
                                onChange={(option) =>
                                    handleInputChange(
                                        'gender',
                                        (option as Option)?.value || '',
                                    )
                                }
                                placeholder="Выберите пол"
                                options={genderOptions}
                            />
                        </FormItem>
                    </div>

                    {/* Disability Information */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Информация об инвалидности
                        </h3>

                        <FormItem label="Тип инвалидности (если есть)">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {disabilityTypeOptions.map((type) => (
                                    <Button
                                        key={type}
                                        size="sm"
                                        variant={
                                            formData.disability_type.includes(
                                                type,
                                            )
                                                ? 'solid'
                                                : 'default'
                                        }
                                        onClick={() =>
                                            handleToggleArray(
                                                'disability_type',
                                                type,
                                            )
                                        }
                                    >
                                        {type}
                                    </Button>
                                ))}
                            </div>

                            {formData.disability_type.includes('Другое') && (
                                <Input
                                    value={formData.disability_description}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'disability_description',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Опишите тип инвалидности"
                                />
                            )}
                        </FormItem>
                    </div>

                    {/* Work Conditions */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Условия труда
                        </h3>

                        <FormItem label="Ваши возможности по работе">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {workConditionOptions.map((condition) => (
                                    <Button
                                        key={condition}
                                        size="sm"
                                        variant={
                                            formData.work_conditions.includes(
                                                condition,
                                            )
                                                ? 'solid'
                                                : 'default'
                                        }
                                        onClick={() =>
                                            handleToggleArray(
                                                'work_conditions',
                                                condition,
                                            )
                                        }
                                    >
                                        {condition}
                                    </Button>
                                ))}
                            </div>
                        </FormItem>

                        <FormItem label="Предпочтения по месту работы">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {workplacePreferenceOptions.map(
                                    (preference) => (
                                        <Button
                                            key={preference}
                                            size="sm"
                                            variant={
                                                formData.workplace_preferences.includes(
                                                    preference,
                                                )
                                                    ? 'solid'
                                                    : 'default'
                                            }
                                            onClick={() =>
                                                handleToggleArray(
                                                    'workplace_preferences',
                                                    preference,
                                                )
                                            }
                                        >
                                            {preference}
                                        </Button>
                                    ),
                                )}
                            </div>

                            {formData.workplace_preferences.includes(
                                'Другое',
                            ) && (
                                <Input
                                    value={formData.workplace_other}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'workplace_other',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Укажите другие предпочтения"
                                />
                            )}
                        </FormItem>
                    </div>
                </Form>

                <div className="flex justify-end mt-8">
                    <Button
                        variant="solid"
                        onClick={handleNext}
                        disabled={!isFormValid}
                        className="min-w-[120px]"
                    >
                        Далее
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default PersonalInfoStep
