'use client'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { TbPlus } from 'react-icons/tb'

export default function VacanciesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Вакансии
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Просмотр и управление доступными вакансиями
                    </p>
                </div>
                <Button variant="solid" icon={<TbPlus />}>
                    Добавить в избранное
                </Button>
            </div>

            <div className="space-y-4">
                <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">
                                Frontend Developer
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                React, TypeScript, Next.js • TechCorp
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>от 150,000 ₽</span>
                                <span>•</span>
                                <span>Удаленно</span>
                                <span>•</span>
                                <span>Полная занятость</span>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm rounded-full">
                            Новая
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button size="sm" variant="solid">
                            Откликнуться
                        </Button>
                        <Button size="sm" variant="plain">
                            Подробнее
                        </Button>
                    </div>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">
                                UX/UI Designer
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                Figma, Adobe Creative Suite • DesignStudio
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>от 120,000 ₽</span>
                                <span>•</span>
                                <span>Гибрид</span>
                                <span>•</span>
                                <span>Полная занятость</span>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-full">
                            Рекомендуемая
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button size="sm" variant="solid">
                            Откликнуться
                        </Button>
                        <Button size="sm" variant="plain">
                            Подробнее
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
