'use client'

import { Menu } from '@/components/ui'
import navigationIcon from '@/configs/navigation-icon.config'
import { Direction } from '@/@types/theme'
import type { NavigationTree, TranslationFn } from '@/@types/navigation'
import classNames from '@/utils/classNames'
import { TbChevronDown } from 'react-icons/tb'
import { PiDotOutlineFill } from 'react-icons/pi'
import { motion } from 'framer-motion'

interface VerticalCollapsedMenuItemProps {
    nav: NavigationTree
    sideCollapsed?: boolean
    direction?: Direction
    indent?: boolean
    dotIndent?: boolean
    userAuthority: string[]
    currentKey?: string
    parentKeys?: string[]
    renderAsIcon?: boolean
    t: TranslationFn
    onLinkClick?: () => void
    children?: React.ReactNode
}

const VerticalCollapsedMenuItem = ({
    nav,
    sideCollapsed,
    direction,
    indent,
    dotIndent,
    currentKey,
    parentKeys = [],
    renderAsIcon = false,
    t,
    onLinkClick,
    children,
}: VerticalCollapsedMenuItemProps) => {
    const itemTitle = t(nav.translateKey) || nav.title
    const icon = navigationIcon[nav.icon]
    const isActive = currentKey === nav.key || parentKeys.includes(nav.key)

    return (
        <Menu.MenuCollapse
            eventKey={nav.key}
            expanded={parentKeys.includes(nav.key)}
            className={classNames(
                'flex items-center h-10 px-2 text-sm font-medium rounded-lg',
                indent && (direction === 'rtl' ? 'mr-4' : 'ml-4'),
                'hover:bg-gray-100 dark:hover:bg-gray-700',
                isActive && 'bg-gray-100 dark:bg-gray-700 text-primary-500',
            )}
            label={
                <div className="flex items-center w-full">
                    {dotIndent && (
                        <PiDotOutlineFill
                            className={classNames(
                                'text-3xl w-[24px]',
                                !isActive && 'opacity-25',
                            )}
                        />
                    )}
                    {!dotIndent && icon && (
                        <span
                            className={classNames(
                                'text-xl',
                                sideCollapsed && 'mx-auto',
                            )}
                        >
                            {icon}
                        </span>
                    )}
                    {(!sideCollapsed || renderAsIcon) && (
                        <span
                            className={classNames(
                                'flex-1 truncate',
                                (icon || dotIndent) &&
                                    (direction === 'rtl' ? 'mr-2' : 'ml-2'),
                            )}
                        >
                            {itemTitle}
                        </span>
                    )}
                    {!sideCollapsed && (
                        <motion.span
                            className="text-lg mt-1"
                            initial={{ transform: 'rotate(0deg)' }}
                            animate={{
                                transform: parentKeys.includes(nav.key)
                                    ? 'rotate(-180deg)'
                                    : 'rotate(0deg)',
                            }}
                            transition={{ duration: 0.15 }}
                        >
                            <TbChevronDown />
                        </motion.span>
                    )}
                </div>
            }
        >
            {children}
        </Menu.MenuCollapse>
    )
}

export default VerticalCollapsedMenuItem
