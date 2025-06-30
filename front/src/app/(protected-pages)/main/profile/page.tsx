'use client'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { TbUser } from 'react-icons/tb'

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Мой профиль
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Управление личной информацией и настройками
                </p>
            </div>

            <Card className="p-6">
                <div className="flex items-center gap-6 mb-6">
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <TbUser className="w-12 h-12 text-gray-500" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-semibold mb-1">
                            Иван Иванов
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                            Frontend Developer
                        </p>
                        <p className="text-sm text-gray-500">
                            Участник с января 2024
                        </p>
                    </div>
                    <Button variant="solid">Редактировать профиль</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold mb-3">
                            Контактная информация
                        </h4>
                        <div className="space-y-2 text-sm">
                            <p>
                                <span className="text-gray-500">Email:</span>{' '}
                                ivan@example.com
                            </p>
                            <p>
                                <span className="text-gray-500">Телефон:</span>{' '}
                                +7 (999) 123-45-67
                            </p>
                            <p>
                                <span className="text-gray-500">Город:</span>{' '}
                                Москва
                            </p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3">
                            Профессиональная информация
                        </h4>
                        <div className="space-y-2 text-sm">
                            <p>
                                <span className="text-gray-500">
                                    Специальность:
                                </span>{' '}
                                Frontend Developer
                            </p>
                            <p>
                                <span className="text-gray-500">
                                    Опыт работы:
                                </span>{' '}
                                3 года
                            </p>
                            <p>
                                <span className="text-gray-500">
                                    Желаемая зарплата:
                                </span>{' '}
                                от 150,000 ₽
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
