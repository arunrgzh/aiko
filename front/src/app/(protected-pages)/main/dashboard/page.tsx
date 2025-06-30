'use client'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import {
    TbApps,
    TbFileText,
    TbBriefcase,
    TbMessageCircle,
    TbUser,
    TbHeart,
    TbVideo,
    TbSettings,
} from 'react-icons/tb'

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Добро пожаловать в AI-Komek
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Платформа для поиска работы с ИИ-помощником
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/main/questionnaire">
                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <TbFileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">
                                    Анкеты
                                </h3>
                                <p className="text-sm text-gray-500">
                                    2 активные
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Управление профилями и анкетами соискателей
                        </p>
                        <Button size="sm" variant="solid">
                            Управлять
                        </Button>
                    </Card>
                </Link>

                <Link href="/main/vacancies">
                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                <TbBriefcase className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">
                                    Вакансии
                                </h3>
                                <p className="text-sm text-gray-500">
                                    15 новых
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Просмотр и управление доступными вакансиями
                        </p>
                        <Button size="sm" variant="solid">
                            Просмотреть
                        </Button>
                    </Card>
                </Link>

                <Link href="/main/ai-chat">
                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                <TbMessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">
                                    ИИ Помощник
                                </h3>
                                <p className="text-sm text-gray-500">Онлайн</p>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Интеллектуальный помощник для поиска работы
                        </p>
                        <Button size="sm" variant="solid">
                            Начать чат
                        </Button>
                    </Card>
                </Link>

                <Link href="/main/profile">
                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                                <TbUser className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">
                                    Профиль
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Обновлен
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Управление личной информацией
                        </p>
                        <Button size="sm" variant="solid">
                            Редактировать
                        </Button>
                    </Card>
                </Link>

                <Link href="/main/responses">
                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                                <TbHeart className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">
                                    Мои отклики
                                </h3>
                                <p className="text-sm text-gray-500">
                                    3 активных
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            История откликов на вакансии
                        </p>
                        <Button size="sm" variant="solid">
                            Посмотреть
                        </Button>
                    </Card>
                </Link>

                <Link href="/main/interviews">
                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                                <TbVideo className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">
                                    Собеседования
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Тренировка
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Пробные собеседования с ИИ
                        </p>
                        <Button size="sm" variant="solid">
                            Начать
                        </Button>
                    </Card>
                </Link>
            </div>

            <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                    Последняя активность
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                            <TbFileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">Анкета обновлена</p>
                            <p className="text-sm text-gray-500">
                                2 часа назад
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                            <TbBriefcase className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">
                                Новая вакансия Frontend Developer
                            </p>
                            <p className="text-sm text-gray-500">
                                5 часов назад
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
