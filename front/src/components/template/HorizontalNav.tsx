'use client'

import HorizontalMenuContent from './HorizontalMenuContent'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import queryRoute from '@/utils/queryRoute'
import appConfig from '@/configs/app.config'
import { usePathname } from 'next/navigation'
import { NavigationTree } from '@/@types/navigation'

const HorizontalNav = ({
    translationSetup = appConfig.activeNavTranslation,
    navigationTree,
}: {
    translationSetup?: boolean
    navigationTree: NavigationTree[]
}) => {
    const pathname = usePathname()

    const route = queryRoute(pathname)

    const currentRouteKey = route?.key || ''

    const { session } = useCurrentSession()

    return (
        <HorizontalMenuContent
            navigationTree={navigationTree}
            routeKey={currentRouteKey}
            userAuthority={session?.user?.authority || []}
            translationSetup={translationSetup}
        />
    )
}

export default HorizontalNav
