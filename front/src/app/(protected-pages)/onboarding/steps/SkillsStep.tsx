'use client'

import { useState, ReactNode } from 'react'
import { Form, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { OnboardingData } from '../page'

interface SkillsStepProps {
    data: OnboardingData
    onUpdate: (data: Partial<OnboardingData>) => void
    onNext: () => void
    onPrevious: () => void
}

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

const SkillsStep = ({
    data,
    onUpdate,
    onNext,
    onPrevious,
}: SkillsStepProps) => {
    const [skills, setSkills] = useState<string[]>(data.skills || [])
    const [newSkill, setNewSkill] = useState('')

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

    const handleAddSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills((prev) => [...prev, newSkill.trim()])
            setNewSkill('')
        }
    }

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkills((prev) => prev.filter((skill) => skill !== skillToRemove))
    }

    const handleAddPopularSkill = (skill: string) => {
        if (!skills.includes(skill)) {
            setSkills((prev) => [...prev, skill])
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddSkill()
        }
    }

    const handleNext = () => {
        onUpdate({ skills })
        onNext()
    }

    const handlePrevious = () => {
        onUpdate({ skills })
        onPrevious()
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Ваши навыки
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Добавьте ваши навыки, чтобы мы могли подобрать вам
                    подходящие возможности
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <Form layout="vertical">
                    <FormItem label="Add Skills">
                        <div className="flex gap-2">
                            <Input
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
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
                        <FormItem label="Ваши навыки">
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                    >
                                        <span>{skill}</span>
                                        <button
                                            onClick={() =>
                                                handleRemoveSkill(skill)
                                            }
                                            className="ml-1 text-blue-600 hover:text-blue-800"
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
                                    onClick={() => handleAddPopularSkill(skill)}
                                >
                                    {skill}
                                </Chip>
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

export default SkillsStep
