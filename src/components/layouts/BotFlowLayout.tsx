import type { CommonProps } from '@/@types/common'

const BotFlowLayout = ({ children }: CommonProps) => {
    return (
        <div className="flex flex-auto flex-col h-[100vh] justify-center items-center">
            <div className={'container'}>
                {children}
            </div>
        </div>
    )
}

export default BotFlowLayout
