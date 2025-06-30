'use client'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import {
    TbPlus,
    TbSettings,
    TbMessageCircle,
    TbUser,
    TbFileText,
    TbBriefcase,
    TbVideo,
    TbHeart,
} from 'react-icons/tb'

type TabContentProps = {
    activeTab: string
}

const TabContent = ({ activeTab }: TabContentProps) => {
    const renderContent = () => {
        switch (activeTab) {
            case 'all':
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

                            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                        <TbMessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            ИИ Помощник
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Онлайн
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Интеллектуальный помощник для поиска работы
                                </p>
                                <Button size="sm" variant="solid">
                                    Начать чат
                                </Button>
                            </Card>
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
                                        <p className="font-medium">
                                            Анкета обновлена
                                        </p>
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

            case 'questionnaire':
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
                                        <h3 className="font-semibold">
                                            Дизайнер UI/UX
                                        </h3>
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

            case 'vacancies':
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
                                Добавить вакансию
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
                                            React, TypeScript, Next.js •
                                            TechCorp
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
                                            Figma, Adobe Creative Suite •
                                            DesignStudio
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

            case 'ai-chat':
                return (
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                ИИ Помощник
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Интеллектуальный помощник для поиска работы и
                                карьерного развития
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
                                <h4 className="font-semibold mb-4">
                                    Как я могу помочь:
                                </h4>
                                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                    <li>• Найти подходящие вакансии</li>
                                    <li>• Подготовиться к собеседованию</li>
                                    <li>• Составить или улучшить резюме</li>
                                    <li>
                                        • Дать советы по карьерному развитию
                                    </li>
                                    <li>• Проанализировать рынок труда</li>
                                </ul>
                            </div>

                            <Button variant="solid" size="lg" block>
                                Начать новый чат
                            </Button>
                        </Card>
                    </div>
                )

            case 'profile':
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
                                <Button variant="solid">
                                    Редактировать профиль
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold mb-3">
                                        Контактная информация
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <p>
                                            <span className="text-gray-500">
                                                Email:
                                            </span>{' '}
                                            ivan@example.com
                                        </p>
                                        <p>
                                            <span className="text-gray-500">
                                                Телефон:
                                            </span>{' '}
                                            +7 (999) 123-45-67
                                        </p>
                                        <p>
                                            <span className="text-gray-500">
                                                Город:
                                            </span>{' '}
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

            case 'responses':
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
                                            Отправлено 3 дня назад • Зарплата:
                                            от 150,000 ₽
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
                                            Отправлено 1 неделю назад •
                                            Зарплата: от 130,000 ₽
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

            case 'interviews':
                return (
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                Пробные собеседования
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Тренировка навыков собеседования с ИИ
                            </p>
                        </div>

                        <Card className="p-6">
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <TbVideo className="w-10 h-10 text-red-600 dark:text-red-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    Пробное собеседование
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Потренируйтесь отвечать на вопросы перед
                                    настоящим собеседованием
                                </p>
                                <Button variant="solid" size="lg">
                                    Начать собеседование
                                </Button>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="font-semibold mb-4">
                                История собеседований
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <p className="font-medium">
                                            Техническое собеседование
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            10 декабря, 2024
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-full">
                                        Отлично
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <p className="font-medium">
                                            Поведенческое интервью
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            5 декабря, 2024
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 text-sm rounded-full">
                                        Хорошо
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>
                )

            case 'settings':
                return (
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                Настройки
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
                                    <input
                                        type="checkbox"
                                        className="rounded"
                                    />
                                </label>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="font-semibold mb-4">Приватность</h3>
                            <div className="space-y-4">
                                <label className="flex items-center justify-between">
                                    <span>
                                        Показывать профиль работодателям
                                    </span>
                                    <input
                                        type="checkbox"
                                        className="rounded"
                                        defaultChecked
                                    />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span>Анонимные отклики</span>
                                    <input
                                        type="checkbox"
                                        className="rounded"
                                    />
                                </label>
                            </div>
                        </Card>

                        <div className="flex justify-end">
                            <Button variant="solid">Сохранить настройки</Button>
                        </div>
                    </div>
                )

            default:
                return (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Выберите раздел из меню</p>
                    </div>
                )
        }
    }

    return <div className="w-full">{renderContent()}</div>
}

export default TabContent
