'use client'

import { useState } from 'react'
import {
    HiSparkles,
    HiClipboardDocumentList,
    HiClock,
    HiUserGroup,
    HiLightBulb,
    HiDocumentText,
    HiCheckCircle,
} from 'react-icons/hi2'
import { Dialog } from '@/components/ui'
import { Button } from '@/components/ui'
import Card from '@/components/ui/Card'

interface AssessmentChoiceModalProps {
    isOpen: boolean
    onClose: () => void
    onChooseAssessment: () => void
    onChooseTraditional: () => void
    loading?: boolean
}

const AssessmentChoiceModal = ({
    isOpen,
    onClose,
    onChooseAssessment,
    onChooseTraditional,
    loading = false,
}: AssessmentChoiceModalProps) => {
    const [selectedOption, setSelectedOption] = useState<
        'assessment' | 'traditional' | null
    >(null)

    const handleContinue = () => {
        if (selectedOption === 'assessment') {
            onChooseAssessment()
        } else if (selectedOption === 'traditional') {
            onChooseTraditional()
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            onRequestClose={onClose}
            closable={false}
        >
            <div className="relative max-w-5xl mx-auto max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="text-center p-10 pb-8 border-b border-gray-100 dark:border-gray-700">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <HiSparkles className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                        Создайте свой профиль
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Выберите наиболее подходящий для вас способ заполнения
                        профиля
                    </p>
                </div>

                {/* Options */}
                <div className="p-10">
                    <div className="grid lg:grid-cols-2 gap-8 mb-10">
                        {/* Assessment Option */}
                        <Card
                            className={`cursor-pointer transition-all duration-200 p-8 border-2 hover:shadow-lg ${
                                selectedOption === 'assessment'
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg ring-2 ring-blue-200 dark:ring-blue-800'
                                    : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                            }`}
                            onClick={() => setSelectedOption('assessment')}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center">
                                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mr-4">
                                        <HiSparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                            Тест навыков
                                        </h3>
                                        <span className="inline-block bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm px-3 py-1 rounded-full font-semibold">
                                            Рекомендуется
                                        </span>
                                    </div>
                                </div>
                                {selectedOption === 'assessment' && (
                                    <HiCheckCircle className="w-8 h-8 text-blue-500" />
                                )}
                            </div>

                            {/* Features */}
                            <ul className="space-y-4 mb-6">
                                <li className="flex items-center text-base text-gray-700 dark:text-gray-300">
                                    <HiClock className="w-6 h-6 text-blue-500 mr-4 flex-shrink-0" />
                                    <span>Быстро - всего 6 вопросов</span>
                                </li>
                                <li className="flex items-center text-base text-gray-700 dark:text-gray-300">
                                    <HiLightBulb className="w-6 h-6 text-blue-500 mr-4 flex-shrink-0" />
                                    <span>ИИ анализ ваших сильных сторон</span>
                                </li>
                                <li className="flex items-center text-base text-gray-700 dark:text-gray-300">
                                    <HiUserGroup className="w-6 h-6 text-blue-500 mr-4 flex-shrink-0" />
                                    <span>Персональные рекомендации</span>
                                </li>
                            </ul>

                            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border-l-4 border-blue-400">
                                <p className="text-base text-blue-700 dark:text-blue-300 leading-relaxed">
                                    ИИ проанализирует ваши ответы и создаст
                                    персональный профиль с рекомендациями
                                </p>
                            </div>
                        </Card>

                        {/* Traditional Option */}
                        <Card
                            className={`cursor-pointer transition-all duration-200 p-8 border-2 hover:shadow-lg ${
                                selectedOption === 'traditional'
                                    ? 'border-gray-500 bg-gray-50 dark:bg-gray-700/50 shadow-lg ring-2 ring-gray-200 dark:ring-gray-600'
                                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                            }`}
                            onClick={() => setSelectedOption('traditional')}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mr-4">
                                        <HiClipboardDocumentList className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                            Подробная анкета
                                        </h3>
                                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                                            Классический способ
                                        </span>
                                    </div>
                                </div>
                                {selectedOption === 'traditional' && (
                                    <HiCheckCircle className="w-8 h-8 text-gray-500" />
                                )}
                            </div>

                            {/* Features */}
                            <ul className="space-y-4 mb-6">
                                <li className="flex items-center text-base text-gray-700 dark:text-gray-300">
                                    <HiDocumentText className="w-6 h-6 text-gray-500 mr-4 flex-shrink-0" />
                                    <span>Подробная информация о навыках</span>
                                </li>
                                <li className="flex items-center text-base text-gray-700 dark:text-gray-300">
                                    <HiUserGroup className="w-6 h-6 text-gray-500 mr-4 flex-shrink-0" />
                                    <span>Детальные предпочтения работы</span>
                                </li>
                                <li className="flex items-center text-base text-gray-700 dark:text-gray-300">
                                    <HiCheckCircle className="w-6 h-6 text-gray-500 mr-4 flex-shrink-0" />
                                    <span>Полный контроль над профилем</span>
                                </li>
                            </ul>

                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border-l-4 border-gray-400">
                                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Заполните детальную информацию о себе и
                                    своих предпочтениях
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-6">
                        <Button
                            variant="plain"
                            onClick={onClose}
                            className="px-8 py-3 text-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                            disabled={loading}
                        >
                            Позже
                        </Button>

                        <Button
                            onClick={handleContinue}
                            disabled={!selectedOption || loading}
                            loading={loading}
                            className={`px-10 py-3 text-lg font-semibold text-white ${
                                selectedOption === 'assessment'
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : selectedOption === 'traditional'
                                      ? 'bg-gray-600 hover:bg-gray-700'
                                      : 'bg-gray-400 cursor-not-allowed'
                            } ${!selectedOption || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {selectedOption === 'assessment' && 'Пройти тест'}
                            {selectedOption === 'traditional' &&
                                'Заполнить анкету'}
                            {!selectedOption && 'Выберите вариант'}
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default AssessmentChoiceModal
