'use client'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Настройки профиля
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Управление настройками профиля и уведомлений
                </p>
            </div>

            <Card className="p-6">
                <h3 className="font-semibold mb-4">Уведомления</h3>
                <div className="space-y-4">
                    <label className="flex items-center justify-between">
                        <span>Уведомления о новых вакансиях</span>
                        <input
                            type="checkbox"
                            className="rounded"
                            defaultChecked
                        />
                    </label>
                    <label className="flex items-center justify-between">
                        <span>Уведомления о откликах</span>
                        <input
                            type="checkbox"
                            className="rounded"
                            defaultChecked
                        />
                    </label>
                    <label className="flex items-center justify-between">
                        <span>Email уведомления</span>
                        <input type="checkbox" className="rounded" />
                    </label>
                </div>
            </Card>

            <Card className="p-6">
                <h3 className="font-semibold mb-4">Приватность</h3>
                <div className="space-y-4">
                    <label className="flex items-center justify-between">
                        <span>Показывать профиль работодателям</span>
                        <input
                            type="checkbox"
                            className="rounded"
                            defaultChecked
                        />
                    </label>
                    <label className="flex items-center justify-between">
                        <span>Анонимные отклики</span>
                        <input type="checkbox" className="rounded" />
                    </label>
                </div>
            </Card>

            <div className="flex justify-end">
                <Button variant="solid">Сохранить настройки</Button>
            </div>
        </div>
    )
}
