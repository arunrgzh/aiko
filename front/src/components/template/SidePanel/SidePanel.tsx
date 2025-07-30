'use client'

import { useState } from 'react'
import classNames from 'classnames'
import Drawer from '@/components/ui/Drawer'
import { PiGearDuotone } from 'react-icons/pi'
import { TbAccessible } from 'react-icons/tb'
import SidePanelContent from './SidePanelContent'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import useTheme from '@/utils/hooks/useTheme'
import useResponsive from '@/utils/hooks/useResponsive'
import type { CommonProps } from '@/@types/common'
import { useTranslations } from 'next-intl'

type SidePanelProps = CommonProps

const _SidePanel = (props: SidePanelProps) => {
    const { className, ...rest } = props
    const t = useTranslations('themeConfig')
    const [isOpen, setIsOpen] = useState(false)

    const direction = useTheme((state) => state.direction)
    const { larger } = useResponsive()

    const openPanel = () => {
        setIsOpen(true)
    }

    const closePanel = () => {
        setIsOpen(false)

        if (document) {
            const bodyClassList = document.body.classList
            if (bodyClassList.contains('drawer-lock-scroll')) {
                bodyClassList.remove('drawer-lock-scroll', 'drawer-open')
            }
        }
    }

    return (
        <>
            <button
                className={classNames(
                    'accessibility-settings-button relative flex items-center justify-center',
                    'w-12 h-12 md:w-14 md:h-14 rounded-xl',
                    'bg-black dark:bg-gray-900 text-white',
                    'hover:bg-gradient-to-r hover:from-blue-500 hover:via-purple-500 hover:to-pink-500',
                    'transition-all duration-300 ease-out',
                    'shadow-lg hover:shadow-xl hover:shadow-blue-500/25',
                    'border-2 border-gray-700 hover:border-transparent',
                    'transform hover:scale-110',
                    'focus:outline-none focus:ring-4 focus:ring-blue-500/50',
                    'group',
                    className,
                )}
                onClick={openPanel}
                aria-label={t('accessibilityTools')}
                title={t('customizeYourExperience')}
                {...rest}
            >
                <TbAccessible className="text-2xl md:text-3xl group-hover:scale-110 group-hover:rotate-360 transition-all duration-500 ease-in-out" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <span className="text-xs text-white font-bold">A</span>
                </div>

                {/* Tooltip */}
                <div
                    className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 
                               bg-gray-900 text-white text-xs px-2 py-1 rounded-md
                               opacity-0 group-hover:opacity-100 transition-opacity duration-200
                               whitespace-nowrap pointer-events-none z-60
                               shadow-lg"
                >
                    <div className="font-semibold">
                        {t('accessibilityTools')}
                    </div>
                    <div className="text-xs text-gray-300">
                        {t('customizeYourExperience')}
                    </div>
                    <div
                        className="absolute -top-1 left-1/2 transform -translate-x-1/2 
                                   w-2 h-2 bg-gray-900 rotate-45"
                    ></div>
                </div>
            </button>
            <Drawer
                title={t('title')}
                isOpen={isOpen}
                placement={direction === 'rtl' ? 'left' : 'right'}
                width={larger.md ? 375 : '90%'}
                bodyClass="p-0"
                onClose={closePanel}
                onRequestClose={closePanel}
                headerClass="py-3 px-4"
            >
                <SidePanelContent callBackClose={closePanel} />
            </Drawer>
        </>
    )
}

const SidePanel = withHeaderItem(_SidePanel)

export default SidePanel
