'use client'

import { useState } from 'react'
import classNames from 'classnames'
import Drawer from '@/components/ui/Drawer'
import { PiGearDuotone } from 'react-icons/pi'
import SidePanelContent from './SidePanelContent'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import useTheme from '@/utils/hooks/useTheme'
import useResponsive from '@/utils/hooks/useResponsive'
import type { CommonProps } from '@/@types/common'

type SidePanelProps = CommonProps

const _SidePanel = (props: SidePanelProps) => {
    const { className, ...rest } = props

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
            <div
                className={classNames(
                    'text-xl md:text-2xl cursor-pointer hover:text-primary-500 transition-colors',
                    className,
                )}
                onClick={openPanel}
                {...rest}
            >
                <PiGearDuotone />
            </div>
            <Drawer
                title="Theme Config"
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
