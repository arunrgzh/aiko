'use client'

import { useState, Suspense, lazy } from 'react'
import classNames from 'classnames'
import Drawer from '@/components/ui/Drawer'
import NavToggle from '@/components/shared/NavToggle'
import { DIR_RTL } from '@/constants/theme.constant'
import withHeaderItem, { WithHeaderItemProps } from '@/utils/hoc/withHeaderItem'
import useNavigation from '@/utils/hooks/useNavigation'
import useTheme from '@/utils/hooks/useTheme'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import queryRoute from '@/utils/queryRoute'
import appConfig from '@/configs/app.config'
import { usePathname } from 'next/navigation'
import { PiList } from 'react-icons/pi'

const VerticalMenuContent = lazy(
    () => import('@/components/template/VerticalMenuContent'),
)

interface MobileNavProps {
    translationSetup?: boolean
    className?: string
}

type MobileNavToggleProps = {
    toggled?: boolean
}

const MobileNavToggle = withHeaderItem<
    MobileNavToggleProps & WithHeaderItemProps
>(NavToggle)

const MobileNav = ({
    translationSetup = appConfig.activeNavTranslation,
    className,
}: MobileNavProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleOpenDrawer = () => {
        setIsOpen(true)
    }

    const handleDrawerClose = () => {
        setIsOpen(false)
    }

    const pathname = usePathname()
    const route = queryRoute(pathname)
    const currentRouteKey = route?.key || ''
    const direction = useTheme((state) => state.direction)
    const { session } = useCurrentSession()
    const { navigationTree } = useNavigation()

    return (
        <>
            <div
                className={classNames(
                    'text-2xl block lg:hidden cursor-pointer transition-colors hover:text-primary-500',
                    className,
                )}
                onClick={handleOpenDrawer}
                role="button"
                aria-label="Toggle navigation menu"
            >
                <PiList className="text-2xl" />
            </div>
            <Drawer
                title={
                    <div className="flex items-center">
                        <PiList className="text-2xl text-gray-900 dark:text-gray-100" />
                    </div>
                }
                isOpen={isOpen}
                bodyClass="p-0"
                width={300}
                placement={direction === DIR_RTL ? 'right' : 'left'}
                onClose={handleDrawerClose}
                onRequestClose={handleDrawerClose}
                headerClass="py-3 px-4 flex items-center"
            >
                <Suspense
                    fallback={
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent" />
                        </div>
                    }
                >
                    {isOpen && (
                        <VerticalMenuContent
                            collapsed={false}
                            navigationTree={navigationTree}
                            routeKey={currentRouteKey}
                            userAuthority={session?.user?.authority || []}
                            translationSetup={translationSetup}
                            direction={direction}
                            onMenuItemClick={handleDrawerClose}
                            className="py-2"
                        />
                    )}
                </Suspense>
            </Drawer>
        </>
    )
}

export default MobileNav
