'use client'

import { useState, ReactNode } from 'react'
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

const popularSkills = [
    // Технологии и IT
    'Программирование',
    'Веб-разработка',
    'Тестирование ПО',
    'Администрирование систем',
    'Работа с базами данных',
    'Аналитика данных',
    'Кибербезопасность',
    'Техническая поддержка',
    // Искусство и дизайн
    'Живопись',
    'Графический дизайн',
    'Фотография',
    'Музыка',
    'Вокал',
    'Танцы',
    'Видеомонтаж',
    'Актерское мастерство',
    // Образование
    'Преподавание',
    'Репетиторство',
    'Разработка учебных программ',
    'Работа с детьми',
    // Медицина и уход
    'Медицинский уход',
    'Массаж',
    'Физиотерапия',
    'Первая помощь',
    'Уход за пожилыми',
    // Сервис и обслуживание
    'Кулинария',
    'Выпечка',
    'Уборка',
    'Гостиничный сервис',
    'Официант',
    'Бариста',
    'Парикмахер',
    'Маникюр/Педикюр',
    // Производство и ремесла
    'Столярное дело',
    'Слесарные работы',
    'Электромонтаж',
    'Сварка',
    'Шитье',
    'Вязание',
    'Ремонт техники',
    // Офис и администрирование
    'Работа с документами',
    'Ввод данных',
    'Бухгалтерия',
    'Планирование',
    'Работа с клиентами',
    // Продажи и маркетинг
    'Продажи',
    'Телемаркетинг',
    'Интернет-маркетинг',
    'SMM',
    'Копирайтинг',
    // Soft skills
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
    // Другое
    'Вождение',
    'Знание иностранных языков',
    'Работа с животными',
    'Садоводство',
    'Ремонт автомобилей',
    'Другое',
]

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
    const [newSkill, setNewSkill] = useState('')
    const [preferredJobTypes, setPreferredJobTypes] = useState<string[]>(
        data.preferred_job_types || [],
    )
    const [newJobType, setNewJobType] = useState('')
    const [preferredLocations, setPreferredLocations] = useState<string[]>(
        data.preferred_locations || [],
    )
    const [newLocation, setNewLocation] = useState('')

    const handleAddSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            const updatedSkills = [...skills, newSkill.trim()]
            setSkills(updatedSkills)
            setNewSkill('')
            onUpdate({ skills: updatedSkills })
        }
    }

    const handleRemoveSkill = (skillToRemove: string) => {
        const updatedSkills = skills.filter((skill) => skill !== skillToRemove)
        setSkills(updatedSkills)
        onUpdate({ skills: updatedSkills })
    }

    const handleSkillToggle = (skill: string) => {
        const updatedSkills = skills.includes(skill)
            ? skills.filter((s) => s !== skill)
            : [...skills, skill]
        setSkills(updatedSkills)
        onUpdate({ skills: updatedSkills })
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddSkill()
        }
    }

    const handleAddJobType = () => {
        if (
            newJobType.trim() &&
            !preferredJobTypes.includes(newJobType.trim())
        ) {
            const updatedJobTypes = [...preferredJobTypes, newJobType.trim()]
            setPreferredJobTypes(updatedJobTypes)
            setNewJobType('')
            onUpdate({ preferred_job_types: updatedJobTypes })
        }
    }

    const handleRemoveJobType = (jobTypeToRemove: string) => {
        const updatedJobTypes = preferredJobTypes.filter(
            (jobType) => jobType !== jobTypeToRemove,
        )
        setPreferredJobTypes(updatedJobTypes)
        onUpdate({ preferred_job_types: updatedJobTypes })
    }

    const handleJobTypeToggle = (jobType: string) => {
        const updatedJobTypes = preferredJobTypes.includes(jobType)
            ? preferredJobTypes.filter((jt) => jt !== jobType)
            : [...preferredJobTypes, jobType]
        setPreferredJobTypes(updatedJobTypes)
        onUpdate({ preferred_job_types: updatedJobTypes })
    }

    const handleAddLocation = () => {
        if (
            newLocation.trim() &&
            !preferredLocations.includes(newLocation.trim())
        ) {
            const updatedLocations = [...preferredLocations, newLocation.trim()]
            setPreferredLocations(updatedLocations)
            setNewLocation('')
            onUpdate({ preferred_locations: updatedLocations })
        }
    }

    const handleRemoveLocation = (locationToRemove: string) => {
        const updatedLocations = preferredLocations.filter(
            (location) => location !== locationToRemove,
        )
        setPreferredLocations(updatedLocations)
        onUpdate({ preferred_locations: updatedLocations })
    }

    const handleLocationToggle = (location: string) => {
        const updatedLocations = preferredLocations.includes(location)
            ? preferredLocations.filter((loc) => loc !== location)
            : [...preferredLocations, location]
        setPreferredLocations(updatedLocations)
        onUpdate({ preferred_locations: updatedLocations })
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
                    {/* Skills Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Ваши навыки
                        </h3>

                        <FormItem label="Добавить навык">
                            <div className="flex gap-2">
                                <Input
                                    value={newSkill}
                                    onChange={(e) =>
                                        setNewSkill(e.target.value)
                                    }
                                    onKeyPress={handleKeyPress}
                                    placeholder="Введите навык и нажмите Enter"
                                    className="flex-1"
                                />
                                <Button
                                    variant="solid"
                                    onClick={handleAddSkill}
                                    disabled={!newSkill.trim()}
                                >
                                    Добавить
                                </Button>
                            </div>
                        </FormItem>

                        {/* Selected Skills */}
                        {skills.length > 0 && (
                            <FormItem label="Выбранные навыки">
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                                        >
                                            <span>{skill}</span>
                                            <button
                                                onClick={() =>
                                                    handleRemoveSkill(skill)
                                                }
                                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </FormItem>
                        )}

                        {/* Popular Skills */}
                        <FormItem label="Популярные навыки">
                            <div className="flex flex-wrap gap-2">
                                {popularSkills.map((skill) => (
                                    <Chip
                                        key={skill}
                                        selected={skills.includes(skill)}
                                        onClick={() => handleSkillToggle(skill)}
                                    >
                                        {skill}
                                    </Chip>
                                ))}
                            </div>
                        </FormItem>
                    </div>

                    {/* Job Preferences Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Предпочтения по работе
                        </h3>

                        <FormItem label="Предпочитаемые типы работ">
                            <div className="flex gap-2 mb-4">
                                <Input
                                    value={newJobType}
                                    onChange={(e) =>
                                        setNewJobType(e.target.value)
                                    }
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

                            {/* Selected Job Types */}
                            {preferredJobTypes.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {preferredJobTypes.map((jobType, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm"
                                        >
                                            <span>{jobType}</span>
                                            <button
                                                onClick={() =>
                                                    handleRemoveJobType(jobType)
                                                }
                                                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Popular Job Types */}
                            <div className="flex flex-wrap gap-2">
                                {popularJobTypes.map((jobType) => (
                                    <Chip
                                        key={jobType}
                                        selected={preferredJobTypes.includes(
                                            jobType,
                                        )}
                                        onClick={() =>
                                            handleJobTypeToggle(jobType)
                                        }
                                    >
                                        {jobType}
                                    </Chip>
                                ))}
                            </div>
                        </FormItem>

                        <FormItem label="Предпочитаемые места работы">
                            <div className="flex gap-2 mb-4">
                                <Input
                                    value={newLocation}
                                    onChange={(e) =>
                                        setNewLocation(e.target.value)
                                    }
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

                            {/* Selected Locations */}
                            {preferredLocations.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {preferredLocations.map(
                                        (location, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm"
                                            >
                                                <span>{location}</span>
                                                <button
                                                    onClick={() =>
                                                        handleRemoveLocation(
                                                            location,
                                                        )
                                                    }
                                                    className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}

                            {/* Popular Locations */}
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
