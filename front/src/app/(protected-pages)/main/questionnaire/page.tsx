'use client'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { TbPlus, TbUser } from 'react-icons/tb'

export default function QuestionnairePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Анкеты
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Управление профилями и анкетами соискателей
                    </p>
                </div>
                <Button variant="solid" icon={<TbPlus />}>
                    Создать анкету
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                            <TbUser className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold">
                                Профиль разработчика
                            </h3>
                            <p className="text-sm text-gray-500">
                                Frontend Developer
                            </p>
                        </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        React, TypeScript, Next.js
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs rounded-full">
                            Активна
                        </span>
                        <Button size="sm" variant="plain">
                            Редактировать
                        </Button>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                            <TbUser className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Дизайнер UI/UX</h3>
                            <p className="text-sm text-gray-500">
                                UI/UX Designer
                            </p>
                        </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        Figma, Adobe XD, Sketch
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 text-xs rounded-full">
                            На модерации
                        </span>
                        <Button size="sm" variant="plain">
                            Редактировать
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
