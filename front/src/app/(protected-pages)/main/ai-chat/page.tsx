'use client'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { TbMessageCircle } from 'react-icons/tb'

export default function AiChatPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    ИИ Помощник
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Интеллектуальный помощник для поиска работы и карьерного
                    развития
                </p>
            </div>

            <Card className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                        <TbMessageCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">
                            Чат с ИИ помощником
                        </h3>
                        <p className="text-green-600 dark:text-green-400 text-sm">
                            ● Онлайн
                        </p>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold mb-4">Как я могу помочь:</h4>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                        <li>• Найти подходящие вакансии</li>
                        <li>• Подготовиться к собеседованию</li>
                        <li>• Составить или улучшить резюме</li>
                        <li>• Дать советы по карьерному развитию</li>
                    </ul>
                </div>

                <Button variant="solid" size="lg" block>
                    Начать новый чат
                </Button>
            </Card>
        </div>
    )
}
