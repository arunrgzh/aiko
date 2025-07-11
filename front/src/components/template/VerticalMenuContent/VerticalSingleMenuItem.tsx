'use client'

import { Menu } from '@/components/ui'
import navigationIcon from '@/configs/navigation-icon.config'
import { Direction } from '@/@types/theme'
import type { NavigationTree, TranslationFn } from '@/@types/navigation'
import Link from 'next/link'
import classNames from '@/utils/classNames'

interface VerticalSingleMenuItemProps {
    nav: NavigationTree
    sideCollapsed?: boolean
    direction?: Direction
    indent?: boolean
    userAuthority: string[]
    currentKey?: string
    parentKeys?: string[]
    showTitle?: boolean
    showIcon?: boolean
    renderAsIcon?: boolean
    t: TranslationFn
    onLinkClick?: () => void
}

const VerticalSingleMenuItem = ({
    nav,
    sideCollapsed,
    direction,
    indent,
    currentKey,
    showTitle = true,
    showIcon = true,
    renderAsIcon = false,
    t,
    onLinkClick,
}: VerticalSingleMenuItemProps) => {
    const itemTitle = t(nav.translateKey) || nav.title
    const icon = navigationIcon[nav.icon]

    const menuItem = (
        <Menu.MenuItem
            eventKey={nav.key}
            className={classNames(
                'flex items-center h-10 px-2 text-sm font-medium rounded-lg',
                indent && (direction === 'rtl' ? 'mr-4' : 'ml-4'),
                'hover:bg-gray-100 dark:hover:bg-gray-700',
                currentKey === nav.key &&
                    'bg-gray-100 dark:bg-gray-700 text-primary-500',
            )}
        >
            <Link
                href={nav.path}
                className="flex items-center w-full h-full"
                onClick={onLinkClick}
            >
                {showIcon && icon && (
                    <span
                        className={classNames(
                            'text-xl',
                            !showTitle && 'mx-auto',
                        )}
                    >
                        {icon}
                    </span>
                )}
                {showTitle && (
                    <span
                        className={classNames(
                            'flex-1 truncate',
                            showIcon && (direction === 'rtl' ? 'mr-2' : 'ml-2'),
                        )}
                    >
                        {itemTitle}
                    </span>
                )}
            </Link>
        </Menu.MenuItem>
    )

    return menuItem
}

export default VerticalSingleMenuItem
