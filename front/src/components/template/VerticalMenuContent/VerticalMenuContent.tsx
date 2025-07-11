'use client'

import { useState, useEffect, Fragment } from 'react'
import Menu from '@/components/ui/Menu'
import VerticalSingleMenuItem from './VerticalSingleMenuItem'
import VerticalCollapsedMenuItem from './VerticalCollapsedMenuItem'
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import { themeConfig } from '@/configs/theme.config'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import useMenuActive from '@/utils/hooks/useMenuActive'
import useTranslation from '@/utils/hooks/useTranslation'
import { Direction } from '@/@types/theme'
import type { NavigationTree, TranslationFn } from '@/@types/navigation'
import classNames from '@/utils/classNames'

export interface VerticalMenuContentProps {
    collapsed?: boolean
    routeKey: string
    navigationTree?: NavigationTree[]
    onMenuItemClick?: () => void
    direction?: Direction
    translationSetup: boolean
    userAuthority: string[]
    className?: string
}

const { MenuGroup } = Menu

const MAX_CASCADE_LEVEL = 2

const VerticalMenuContent = (props: VerticalMenuContentProps) => {
    const {
        collapsed,
        routeKey,
        navigationTree = [],
        onMenuItemClick,
        direction = themeConfig.direction,
        translationSetup,
        userAuthority,
        className,
    } = props

    const translationPlaceholder = (key: string, fallback?: string) => {
        return fallback || key
    }

    const t = (
        translationSetup ? useTranslation() : translationPlaceholder
    ) as TranslationFn

    const [defaultExpandedKeys, setDefaultExpandedKeys] = useState<string[]>([])

    const { activedRoute } = useMenuActive(navigationTree, routeKey)

    useEffect(() => {
        if (activedRoute?.parentKey) {
            setDefaultExpandedKeys([activedRoute.parentKey])
        }
    }, [activedRoute?.parentKey])

    const handleLinkClick = () => {
        onMenuItemClick?.()
    }

    const renderNavigation = (
        navTree: NavigationTree[],
        cascade: number = 0,
        indent?: boolean,
    ) => {
        const nextCascade = cascade + 1

        return (
            <>
                {navTree.map((nav) => (
                    <Fragment key={nav.key}>
                        {nav.type === NAV_ITEM_TYPE_TITLE && (
                            <MenuGroup
                                label={t(nav.translateKey) || nav.title}
                            />
                        )}
                        {nav.type === NAV_ITEM_TYPE_ITEM && (
                            <AuthorityCheck
                                userAuthority={userAuthority}
                                authority={nav.authority}
                            >
                                <VerticalSingleMenuItem
                                    key={nav.key}
                                    nav={nav}
                                    sideCollapsed={collapsed}
                                    direction={direction}
                                    indent={indent}
                                    userAuthority={userAuthority}
                                    currentKey={activedRoute?.key}
                                    parentKeys={defaultExpandedKeys}
                                    showTitle={
                                        collapsed
                                            ? cascade >= 1
                                            : cascade <= MAX_CASCADE_LEVEL
                                    }
                                    showIcon={cascade <= 0}
                                    renderAsIcon={cascade <= 0}
                                    t={t}
                                    onLinkClick={handleLinkClick}
                                />
                            </AuthorityCheck>
                        )}
                        {nav.type === NAV_ITEM_TYPE_COLLAPSE && (
                            <AuthorityCheck
                                userAuthority={userAuthority}
                                authority={nav.authority}
                            >
                                <VerticalCollapsedMenuItem
                                    key={nav.key}
                                    nav={nav}
                                    sideCollapsed={collapsed}
                                    direction={direction}
                                    indent={nextCascade >= MAX_CASCADE_LEVEL}
                                    dotIndent={nextCascade >= MAX_CASCADE_LEVEL}
                                    renderAsIcon={nextCascade <= 1}
                                    userAuthority={userAuthority}
                                    currentKey={activedRoute?.key}
                                    parentKeys={defaultExpandedKeys}
                                    t={t}
                                    onLinkClick={onMenuItemClick}
                                >
                                    {nav.subMenu &&
                                        nav.subMenu.length > 0 &&
                                        renderNavigation(
                                            nav.subMenu,
                                            nextCascade,
                                            true,
                                        )}
                                </VerticalCollapsedMenuItem>
                            </AuthorityCheck>
                        )}
                    </Fragment>
                ))}
            </>
        )
    }

    return (
        <Menu
            className={classNames('px-4 pb-4', className)}
            sideCollapsed={collapsed}
            defaultActiveKeys={activedRoute?.key ? [activedRoute.key] : []}
            defaultExpandedKeys={defaultExpandedKeys}
            defaultCollapseActiveKeys={
                activedRoute?.parentKey ? [activedRoute.parentKey] : []
            }
        >
            {renderNavigation(navigationTree, 0)}
        </Menu>
    )
}

export default VerticalMenuContent
