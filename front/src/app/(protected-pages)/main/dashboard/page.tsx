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
    TbTrendingUp,
} from 'react-icons/tb'

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative px-6 py-24 mx-auto max-w-7xl sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
                            Добро пожаловать в{' '}
                            <span className="text-yellow-300">AI-Komek</span>
                        </h1>
                        <p className="text-xl leading-8 text-gray-100 mb-8">
                            Платформа для поиска работы с ИИ-помощником. Найдите
                            идеальную работу с помощью искусственного
                            интеллекта.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                                <TbTrendingUp className="w-5 h-5 text-green-300" />
                                <span className="text-sm font-medium">
                                    95% успешных трудоустройств
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                                <TbFileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    2
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Активные анкеты
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                                <TbBriefcase className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    15
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Новые вакансии
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                                <TbHeart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    3
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Активные отклики
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Service Cards */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        Выберите нужный сервис
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Link href="/main/questionnaire" className="group">
                            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 bg-white dark:bg-gray-800 rounded-2xl group-hover:scale-105">
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl group-hover:scale-110 transition-transform">
                                        <TbFileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                            Анкеты
                                        </h3>
                                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                            2 активные
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                    Управление профилями и анкетами соискателей.
                                    Создавайте и редактируйте свои резюме.
                                </p>
                                <Button
                                    size="sm"
                                    variant="solid"
                                    className="w-full"
                                >
                                    Управлять анкетами
                                </Button>
                            </Card>
                        </Link>

                        <Link href="/main/vacancies" className="group">
                            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-200 dark:hover:border-green-800 bg-white dark:bg-gray-800 rounded-2xl group-hover:scale-105">
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl group-hover:scale-110 transition-transform">
                                        <TbBriefcase className="w-8 h-8 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                            Вакансии
                                        </h3>
                                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                            15 новых
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                    Просмотр и поиск доступных вакансий. Найдите
                                    работу своей мечты с ИИ-рекомендациями.
                                </p>
                                <Button
                                    size="sm"
                                    variant="solid"
                                    className="w-full"
                                >
                                    Просмотреть вакансии
                                </Button>
                            </Card>
                        </Link>

                        <Link href="/main/ai-chat" className="group">
                            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-800 bg-white dark:bg-gray-800 rounded-2xl group-hover:scale-105">
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl group-hover:scale-110 transition-transform">
                                        <TbMessageCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                            ИИ Помощник
                                        </h3>
                                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                            ● Онлайн
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                    Интеллектуальный помощник для поиска работы
                                    и карьерного консультирования.
                                </p>
                                <Button
                                    size="sm"
                                    variant="solid"
                                    className="w-full"
                                >
                                    Начать чат с ИИ
                                </Button>
                            </Card>
                        </Link>

                        <Link href="/main/profile" className="group">
                            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-orange-200 dark:hover:border-orange-800 bg-white dark:bg-gray-800 rounded-2xl group-hover:scale-105">
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="p-4 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl group-hover:scale-110 transition-transform">
                                        <TbUser className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                            Профиль
                                        </h3>
                                        <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                                            Обновлен
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                    Управление личной информацией и
                                    профессиональными данными.
                                </p>
                                <Button
                                    size="sm"
                                    variant="solid"
                                    className="w-full"
                                >
                                    Редактировать профиль
                                </Button>
                            </Card>
                        </Link>

                        <Link href="/main/responses" className="group">
                            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-red-200 dark:hover:border-red-800 bg-white dark:bg-gray-800 rounded-2xl group-hover:scale-105">
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="p-4 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl group-hover:scale-110 transition-transform">
                                        <TbHeart className="w-8 h-8 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                            Мои отклики
                                        </h3>
                                        <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                                            3 активных
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                    История откликов на вакансии и отслеживание
                                    их статусов.
                                </p>
                                <Button
                                    size="sm"
                                    variant="solid"
                                    className="w-full"
                                >
                                    Посмотреть отклики
                                </Button>
                            </Card>
                        </Link>

                        <Link href="/main/interviews" className="group">
                            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 bg-white dark:bg-gray-800 rounded-2xl group-hover:scale-105">
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="p-4 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-2xl group-hover:scale-110 transition-transform">
                                        <TbVideo className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                            Собеседования
                                        </h3>
                                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                            Тренировка доступна
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                    Пробные собеседования с ИИ для подготовки к
                                    реальным интервью.
                                </p>
                                <Button
                                    size="sm"
                                    variant="solid"
                                    className="w-full"
                                >
                                    Начать тренировку
                                </Button>
                            </Card>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-16">
                    <Card className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Последняя активность
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                                    <TbFileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        Анкета обновлена
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        2 часа назад
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-800/30">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                                    <TbBriefcase className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        Новая вакансия: Frontend Developer
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        5 часов назад
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
