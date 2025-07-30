'use client'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import NavList from './NavList'
import Drawer from '@/components/ui/Drawer'
import classNames from '@/utils/classNames'
import useScrollTop from '@/utils/hooks/useScrollTop'
import Image from 'next/image'
import { TbMenu2 } from 'react-icons/tb'
import Link from 'next/link'
import type { Mode } from '@/@types/theme'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import LanguageSelector from '@/components/template/LanguageSelector'
import SidePanel from '@/components/template/SidePanel/SidePanel'

type NavigationProps = {
    toggleMode: () => void
    mode: Mode
}

const Navigation = ({ toggleMode, mode }: NavigationProps) => {
    const router = useRouter()

    const tNav = useTranslations('landing.nav')
    const tCommon = useTranslations('landing.button')
    const tNavigation = useTranslations('navigation')

    const handleLogin = () => {
        router.push('/sign-in')
    }
    const { isSticky } = useScrollTop()

    const [isOpen, setIsOpen] = useState(false)

    const openDrawer = () => {
        setIsOpen(true)
    }

    const onDrawerClose = () => {
        setIsOpen(false)
    }

    const navMenu = [
        { title: tNav('main'), value: 'features', to: 'features' },
        { title: tNav('audience'), value: 'audience', to: 'audience' },
        {
            title: tNav('features'),
            value: 'otherFeatures',
            to: 'otherFeatures',
        },
        { title: tNav('opport'), value: 'demos', to: 'demos' },
    ]

    return (
        <div
            style={{ transition: 'all 0.2s ease-in-out' }}
            className={classNames(
                'w-full fixed inset-x-0 z-[50]',
                isSticky ? 'top-4' : 'top-0',
            )}
        >
            <div
                className={classNames(
                    'flex flex-row self-start items-center justify-between py-3 max-w-7xl mx-auto px-4 rounded-xl relative z-[60] w-full transition duration-200',
                    isSticky
                        ? 'bg-white dark:bg-gray-800 shadow-lg'
                        : 'bg-transparent dark:bg-transparent',
                )}
            >
                <button
                    onClick={openDrawer}
                    className="flex lg:hidden items-center gap-4"
                >
                    <TbMenu2 size={24} />
                </button>
                <Drawer
                    title={tNavigation('drawer.title')}
                    isOpen={isOpen}
                    onClose={onDrawerClose}
                    onRequestClose={onDrawerClose}
                    width={250}
                    placement="left"
                >
                    <div className="flex flex-col gap-4">
                        <NavList onTabClick={onDrawerClose} tabs={navMenu} />
                    </div>
                </Drawer>
                <Link href="/">
                    {mode === 'light' && (
                        <Image
                            src="/img/logo/logo-full-light.png"
                            width={180}
                            height={80}
                            alt="logo"
                        />
                    )}
                    {mode === 'dark' && (
                        <Image
                            src="/img/logo/logo-full-dark.png"
                            width={180}
                            height={80}
                            alt="logo"
                        />
                    )}
                </Link>
                <div
                    className="lg:flex flex-row flex-1
                33 hidden items-center justify-center text-sm text-zinc-600 font-medium hover:text-zinc-800 transition duration-200 [perspective:1000px] overflow-auto sm:overflow-visible no-visible-scrollbar"
                >
                    <NavList tabs={navMenu} />
                </div>
                <div className="flex items-center gap-2">
                    <SidePanel />
                    <button
                        className="relative flex cursor-pointer items-center justify-center rounded-xl p-2 text-neutral-500 hover:shadow-input dark:text-neutral-500"
                        onClick={toggleMode}
                        aria-label={tNavigation('buttons.toggleTheme')}
                    >
                        <svg
                            className="lucide lucide-sun rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                            fill="none"
                            height="16"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="16"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="12" cy="12" r="4" />
                            <path d="M12 2v2" />
                            <path d="M12 20v2" />
                            <path d="m4.93 4.93 1.41 1.41" />
                            <path d="m17.66 17.66 1.41 1.41" />
                            <path d="M2 12h2" />
                            <path d="M20 12h2" />
                            <path d="m6.34 17.66-1.41 1.41" />
                            <path d="m19.07 4.93-1.41 1.41" />
                        </svg>
                        <svg
                            className="lucide lucide-moon absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                            fill="none"
                            height="16"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="16"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                        </svg>
                        <span className="sr-only">
                            {tNavigation('buttons.toggleTheme')}
                        </span>
                    </button>
                    <div className="relative border border-gray-200 dark:border-gray-700 rounded-full inline-flex items-center justify-center gap-0 py-1 px-4 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <img
                            src="/img/logo/logo.png"
                            alt="log in"
                            className="w-6 h-6"
                        />

                        <Button variant="plain" onClick={handleLogin}>
                            {tNavigation('buttons.login')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navigation
