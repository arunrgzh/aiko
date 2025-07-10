'use client'

import { useState, ReactNode, useEffect, useMemo } from 'react'
import { Form, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { OnboardingData } from '../page'

const Chip = ({
    selected,
    children,
    ...props
}: {
    selected: boolean
    children: ReactNode
    [key: string]: any
}) => (
    <button
        type="button"
        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-150 
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
            active:scale-95 active:shadow-sm transform
            ${
                selected
                    ? 'bg-blue-500 text-white border-blue-500 shadow-md hover:bg-blue-600 hover:border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600'
            }
        `}
        aria-pressed={selected}
        {...props}
    >
        {children}
    </button>
)

interface SkillsAndPreferencesStepProps {
    data: OnboardingData
    onUpdate: (data: Partial<OnboardingData>) => void
    onNext: () => void
    onPrevious: () => void
}

const categorizedSkills = {
    'Технологии и IT': [
        'Программирование',
        'Веб-разработка',
        'Тестирование ПО',
        'Администрирование систем',
        'Работа с базами данных',
        'Аналитика данных',
        'Кибербезопасность',
        'Техническая поддержка',
    ],
    'Искусство и дизайн': [
        'Живопись',
        'Графический дизайн',
        'Фотография',
        'Музыка',
        'Вокал',
        'Танцы',
        'Видеомонтаж',
        'Актерское мастерство',
    ],
    Образование: [
        'Преподавание',
        'Репетиторство',
        'Разработка учебных программ',
        'Работа с детьми',
    ],
    'Медицина и уход': [
        'Медицинский уход',
        'Массаж',
        'Физиотерапия',
        'Первая помощь',
        'Уход за пожилыми',
    ],
    'Сервис и обслуживание': [
        'Кулинария',
        'Выпечка',
        'Уборка',
        'Гостиничный сервис',
        'Официант',
        'Бариста',
        'Парикмахер',
        'Маникюр/Педикюр',
    ],
    'Производство и ремесла': [
        'Столярное дело',
        'Слесарные работы',
        'Электромонтаж',
        'Сварка',
        'Шитье',
        'Вязание',
        'Ремонт техники',
    ],
    'Офис и администрирование': [
        'Работа с документами',
        'Ввод данных',
        'Бухгалтерия',
        'Планирование',
        'Работа с клиентами',
    ],
    'Продажи и маркетинг': [
        'Продажи',
        'Телемаркетинг',
        'Интернет-маркетинг',
        'SMM',
        'Копирайтинг',
    ],
    'Soft skills': [
        'Коммуникация',
        'Работа в команде',
        'Лидерство',
        'Организаторские способности',
        'Креативность',
        'Стрессоустойчивость',
        'Публичные выступления',
        'Решение конфликтов',
        'Эмпатия',
        'Тайм-менеджмент',
    ],
    Другое: [
        'Вождение',
        'Знание иностранных языков',
        'Работа с животными',
        'Садоводство',
        'Ремонт автомобилей',
        'Другое',
    ],
}

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

const SkillsAndPreferencesStep = ({
    data,
    onUpdate,
    onNext,
    onPrevious,
}: SkillsAndPreferencesStepProps) => {
    const [skills, setSkills] = useState<string[]>(data.skills || [])
    const [searchQuery, setSearchQuery] = useState('')
    const [preferredJobTypes, setPreferredJobTypes] = useState<string[]>(
        data.preferred_job_types || [],
    )
    const [newJobType, setNewJobType] = useState('')
    const [preferredLocations, setPreferredLocations] = useState<string[]>(
        data.preferred_locations || [],
    )
    const [newLocation, setNewLocation] = useState('')

    // Синхронизируем с родительским компонентом через useEffect
    useEffect(() => {
        const timeout = setTimeout(() => {
            onUpdate({
                skills,
                preferred_job_types: preferredJobTypes,
                preferred_locations: preferredLocations,
            })
        }, 0)
        return () => clearTimeout(timeout)
    }, [skills, preferredJobTypes, preferredLocations])

    const handleRemoveSkill = (skillToRemove: string) => {
        const updatedSkills = skills.filter((skill) => skill !== skillToRemove)
        setSkills(updatedSkills)
    }

    const handleSkillToggle = (skill: string) => {
        const updatedSkills = skills.includes(skill)
            ? skills.filter((s) => s !== skill)
            : [...skills, skill]
        setSkills(updatedSkills)
    }

    const filteredSkills = useMemo(() => {
        if (!searchQuery) {
            return []
        }
        const lowercasedQuery = searchQuery.toLowerCase()
        const allSkills = Object.values(categorizedSkills).flat()
        return allSkills.filter((skill) =>
            skill.toLowerCase().includes(lowercasedQuery),
        )
    }, [searchQuery])

    const handleAddJobType = () => {
        if (
            newJobType.trim() &&
            !preferredJobTypes.includes(newJobType.trim())
        ) {
            const updatedJobTypes = [...preferredJobTypes, newJobType.trim()]
            setPreferredJobTypes(updatedJobTypes)
            setNewJobType('')
        }
    }

    const handleRemoveJobType = (jobTypeToRemove: string) => {
        const updatedJobTypes = preferredJobTypes.filter(
            (jobType) => jobType !== jobTypeToRemove,
        )
        setPreferredJobTypes(updatedJobTypes)
    }

    const handleJobTypeToggle = (jobType: string) => {
        const updatedJobTypes = preferredJobTypes.includes(jobType)
            ? preferredJobTypes.filter((jt) => jt !== jobType)
            : [...preferredJobTypes, jobType]
        setPreferredJobTypes(updatedJobTypes)
    }

    const handleAddLocation = () => {
        if (
            newLocation.trim() &&
            !preferredLocations.includes(newLocation.trim())
        ) {
            const updatedLocations = [...preferredLocations, newLocation.trim()]
            setPreferredLocations(updatedLocations)
            setNewLocation('')
        }
    }

    const handleRemoveLocation = (locationToRemove: string) => {
        const updatedLocations = preferredLocations.filter(
            (location) => location !== locationToRemove,
        )
        setPreferredLocations(updatedLocations)
    }

    const handleLocationToggle = (location: string) => {
        const updatedLocations = preferredLocations.includes(location)
            ? preferredLocations.filter((loc) => loc !== location)
            : [...preferredLocations, location]
        setPreferredLocations(updatedLocations)
    }

    const handleNext = () => {
        onNext()
    }

    const handlePrevious = () => {
        onPrevious()
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Навыки и предпочтения
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Расскажите о ваших навыках и предпочтениях по работе
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <Form layout="vertical">
                    {/* Skills */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Ваши навыки
                        </h3>

                        <FormItem label="Навыки и умения">
                            {/* Selected skills */}
                            {skills.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Выбранные навыки
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill) => (
                                            <div
                                                key={skill}
                                                className="inline-flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                            >
                                                <span>{skill}</span>
                                                <button
                                                    onClick={() =>
                                                        handleRemoveSkill(skill)
                                                    }
                                                    className="ml-1 text-blue-600 hover:text-blue-800 font-bold"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Search Input */}
                            <div className="mb-4">
                                <Input
                                    placeholder="Начните вводить название навыка для поиска..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full"
                                />
                            </div>

                            {/* Display Area */}
                            {searchQuery ? (
                                // Search Results
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Результаты поиска
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {filteredSkills.length > 0 ? (
                                            filteredSkills.map((skill) => (
                                                <Chip
                                                    key={skill}
                                                    selected={skills.includes(
                                                        skill,
                                                    )}
                                                    onClick={() =>
                                                        handleSkillToggle(skill)
                                                    }
                                                >
                                                    {skill}
                                                </Chip>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">
                                                Навыки не найдены.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                // Categorized Skills
                                <div className="space-y-6">
                                    {Object.entries(categorizedSkills).map(
                                        ([category, categorySkills]) => (
                                            <div key={category}>
                                                <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">
                                                    {category}
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {categorySkills.map(
                                                        (skill) => (
                                                            <Chip
                                                                key={skill}
                                                                selected={skills.includes(
                                                                    skill,
                                                                )}
                                                                onClick={() =>
                                                                    handleSkillToggle(
                                                                        skill,
                                                                    )
                                                                }
                                                            >
                                                                {skill}
                                                            </Chip>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}
                        </FormItem>
                    </div>

                    {/* Job Preferences */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Предпочтения по работе
                        </h3>

                        <FormItem label="Предпочитаемые типы работы">
                            {/* Selected job types */}
                            {preferredJobTypes.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Выбранные типы работы
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {preferredJobTypes.map((type) => (
                                            <div
                                                key={type}
                                                className="inline-flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                            >
                                                <span>{type}</span>
                                                <button
                                                    onClick={() =>
                                                        handleRemoveJobType(
                                                            type,
                                                        )
                                                    }
                                                    className="ml-1 text-blue-600 hover:text-blue-800 font-bold"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Available job types */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Популярные типы работы
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {popularJobTypes.map((type) => (
                                        <Chip
                                            key={type}
                                            selected={preferredJobTypes.includes(
                                                type,
                                            )}
                                            onClick={() =>
                                                handleJobTypeToggle(type)
                                            }
                                        >
                                            {type}
                                        </Chip>
                                    ))}
                                </div>
                            </div>
                        </FormItem>

                        <FormItem label="Предпочитаемые локации">
                            {/* Selected locations */}
                            {preferredLocations.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Выбранные локации
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {preferredLocations.map((location) => (
                                            <div
                                                key={location}
                                                className="inline-flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                            >
                                                <span>{location}</span>
                                                <button
                                                    onClick={() =>
                                                        handleRemoveLocation(
                                                            location,
                                                        )
                                                    }
                                                    className="ml-1 text-blue-600 hover:text-blue-800 font-bold"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Available locations */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Популярные локации
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {popularLocations.map((location) => (
                                        <Chip
                                            key={location}
                                            selected={preferredLocations.includes(
                                                location,
                                            )}
                                            onClick={() =>
                                                handleLocationToggle(location)
                                            }
                                        >
                                            {location}
                                        </Chip>
                                    ))}
                                </div>
                            </div>
                        </FormItem>
                    </div>
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

export default SkillsAndPreferencesStep
