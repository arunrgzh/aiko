'use client'

// import {
//     LAYOUT_STACKED_SIDE,
//     LAYOUT_TOP_BAR_CLASSIC,
//     LAYOUT_FRAMELESS_SIDE,
//     LAYOUT_CONTENT_OVERLAY,
//     LAYOUT_BLANK,
// } from '@/constants/theme.constant'
// import FrameLessSide from './components/FrameLessSide'
// import StackedSide from './components/StackedSide'
// import TopBarClassic from './components/TopBarClassic'
import ContentOverlay from './components/ContentOverlay'
// import Blank from './components/Blank'
import PageContainer from '@/components/template/PageContainer'
import queryRoute from '@/utils/queryRoute'
// import useTheme from '@/utils/hooks/useTheme'
import { usePathname } from 'next/navigation'
import type { CommonProps } from '@/@types/common'
// import type { LayoutType } from '@/@types/theme'

// interface DashboardLayoutProps extends CommonProps {
//     layoutType: LayoutType
// }
//
// const Layout = ({ children, layoutType }: DashboardLayoutProps) => {
//     switch (layoutType) {
//         case LAYOUT_STACKED_SIDE:
//             return <StackedSide>{children}</StackedSide>
//         case LAYOUT_TOP_BAR_CLASSIC:
//             return <TopBarClassic>{children}</TopBarClassic>
//         case LAYOUT_FRAMELESS_SIDE:
//             return <FrameLessSide>{children}</FrameLessSide>
//         case LAYOUT_CONTENT_OVERLAY:
//             return <ContentOverlay>{children}</ContentOverlay>
//         case LAYOUT_BLANK:
//             return <Blank>{children}</Blank>
//         default:
//             return <>{children}</>
//     }
// }

const DashboardLayout = ({ children }: CommonProps) => {
    const pathname = usePathname()

    const route = queryRoute(pathname)

    return (
        <ContentOverlay withSidePanel={false} isMainPages={true}>
            <PageContainer className={'h-screen'} {...route?.meta}>{children}</PageContainer>
        </ContentOverlay>
    )
}

export default DashboardLayout
