'use client'

import Steps from '@/components/ui/Steps'
import Content from './Content'
import { useCreationFlowStore } from '@/app/(protected-pages)/bot-flow/_general/store/flowCreation'



export default function Flow() {
    const step = useCreationFlowStore(state => state.step)

    return (
        <div>
            <Steps current={step}>
                <Steps.Item title="Наименования" />
                <Steps.Item title="Стиль" />
                <Steps.Item title="Корректирования процесса разговора" />
                <Steps.Item title="Привязка Сот. сетей" />
            </Steps>
            <div className="mt-6 py-3 bg-gray-50 dark:bg-gray-700 rounded flex items-center justify-center">
                <Content step={step} />
            </div>
            <div className="mt-4 text-right">
            </div>
        </div>
    )
}


