import classNames from '@/utils/classNames'
import { HEADER_HEIGHT } from '@/constants/theme.constant'
import type { ReactNode } from 'react'
import type { CommonProps } from '@/@types/common'

interface HeaderProps extends CommonProps {
    headerStart?: ReactNode
    headerEnd?: ReactNode
    headerMiddle?: ReactNode
    container?: boolean
    wrapperClass?: string
}

const Header = (props: HeaderProps) => {
    const {
        headerStart,
        headerEnd,
        headerMiddle,
        className,
        container,
        wrapperClass,
    } = props

    return (
        <header
            className={classNames(
                'header bg-white dark:bg-gray-900 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 relative z-10',
                className,
            )}
        >
            <div
                className={classNames(
                    'header-wrapper flex items-center justify-between px-6',
                    container && 'container mx-auto',
                    wrapperClass,
                )}
                style={{ height: HEADER_HEIGHT }}
            >
                <div className="header-action header-action-start flex items-center gap-4">
                    {headerStart}
                </div>
                {headerMiddle && (
                    <div className="header-action header-action-middle flex-1 flex items-center justify-center">
                        {headerMiddle}
                    </div>
                )}
                <div className="header-action header-action-end flex items-center gap-4">
                    {headerEnd}
                </div>
            </div>
        </header>
    )
}

export default Header
