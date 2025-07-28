'use client'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { TbVideo } from 'react-icons/tb'
import Badge from '@/components/ui/Badge'
import { useTranslations } from 'next-intl'

export default function InterviewsPage() {
    const t = useTranslations('interviews')

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {t('title')}
                    </h1>
                    <Badge
                        className="text-sm"
                        innerClass="bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    >
                        {t('comingSoon')}
                    </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                    {t('subtitle')}
                </p>
            </div>

            <Card className="p-6">
                <div className="text-center py-8">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TbVideo className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                        {t('practiceInterview.title')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {t('practiceInterview.description')}
                    </p>
                    <Button variant="solid" size="lg">
                        {t('practiceInterview.startButton')}
                    </Button>
                </div>
            </Card>

            <Card className="p-6">
                <h3 className="font-semibold mb-4">{t('history.title')}</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                            <p className="font-medium">
                                {t('history.technicalInterview')}
                            </p>
                            <p className="text-sm text-gray-500">
                                10 декабря, 2024
                            </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-full">
                            {t('history.excellent')}
                        </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                            <p className="font-medium">
                                {t('history.behavioralInterview')}
                            </p>
                            <p className="text-sm text-gray-500">
                                5 декабря, 2024
                            </p>
                        </div>
                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 text-sm rounded-full">
                            {t('history.good')}
                        </span>
                    </div>
                </div>
            </Card>
        </div>
    )
}
