'use client'

import Header from '@/components/template/Header'
import SidePanel from '@/components/template/SidePanel'
import UserProfileDropdown from '@/components/template/UserProfileDropdown'
import LanguageSelector from '@/components/template/LanguageSelector'
import Notification from '@/components/template/Notification'
import HeaderLogo from '@/components/template/HeaderLogo'
import Search from '@/components/template/Search'
import MobileNav from '@/components/template/MobileNav'
import HorizontalNav from '@/components/template/HorizontalNav'
import LayoutBase from '@/components/template/LayoutBase'
import ThemeToggle from '@/components/template/ThemeToggle'
import { LAYOUT_TOP_BAR_CLASSIC } from '@/constants/theme.constant'
import type { CommonProps } from '@/@types/common'
import useNavigation from '@/utils/hooks/useNavigation'

const TopBarClassic = ({ children }: CommonProps) => {
    const navigation = useNavigation()
    return (
        <LayoutBase
            type={LAYOUT_TOP_BAR_CLASSIC}
            className="app-layout-top-bar-classic flex flex-auto flex-col min-h-screen"
        >
            <div className="flex flex-auto min-w-0">
                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
                    <Header
                        container
                        className="shadow-sm dark:shadow-2xl"
                        headerStart={
                            <div className="flex items-center gap-2 md:gap-4">
                                <MobileNav className="lg:hidden" />
                                <HeaderLogo />
                            </div>
                        }
                        headerMiddle={
                            <div className="hidden lg:block w-full max-w-[800px]">
                                <HorizontalNav
                                    navigationTree={navigation.navigationTree}
                                />
                            </div>
                        }
                        headerEnd={
                            <div className="flex items-center gap-2 md:gap-4">
                                <Search className="hidden md:flex" />
                                <ThemeToggle />
                                <LanguageSelector />
                                <Notification />
                                <SidePanel />
                                <UserProfileDropdown hoverable={false} />
                            </div>
                        }
                    />
                    <div className="flex flex-col flex-1 overflow-hidden">
                        {children}
                    </div>
                </div>
            </div>
        </LayoutBase>
    )
}

export default TopBarClassic
