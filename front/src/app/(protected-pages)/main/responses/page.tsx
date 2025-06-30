'use client'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function ResponsesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Мои отклики
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    История откликов на вакансии и их статусы
                </p>
            </div>

            <div className="space-y-4">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">
                                Frontend Developer в TechCorp
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                React, TypeScript, Next.js
                            </p>
                            <p className="text-sm text-gray-500">
                                Отправлено 3 дня назад • Зарплата: от 150,000 ₽
                            </p>
                        </div>
                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 text-sm rounded-full">
                            На рассмотрении
                        </span>
                    </div>
                    <Button size="sm" variant="plain">
                        Отменить отклик
                    </Button>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">
                                React Developer в StartupXYZ
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                React, Node.js, MongoDB
                            </p>
                            <p className="text-sm text-gray-500">
                                Отправлено 1 неделю назад • Зарплата: от 130,000
                                ₽
                            </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-full">
                            Приглашение на собеседование
                        </span>
                    </div>
                    <Button size="sm" variant="solid">
                        Подготовиться к собеседованию
                    </Button>
                </Card>
            </div>
        </div>
    )
}
