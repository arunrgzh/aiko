'use client'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Container from './LandingContainer'
import demoCategoriesIcons from '../utils/demo-categories-icons.config'
import {
    allDemos,
    projectDemos,
    ecommerceDemos,
    aiDemos,
    appsDemos,
    marketingDemos,
    helpCenterDemos,
    accountDemos,
    authDemos,
} from '../utils//demos-gallery.config'
import classNames from '@/utils/classNames'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Mode } from '@/@types/theme'
import { useTranslations } from 'next-intl'

type DemoProps = {
    mode: Mode
}

const DemoCard = ({
    id,
    name,
    path,
    mode,
}: {
    id: string
    name: string
    path: string
    mode: Mode
}) => {
    return (
        <Link href={path}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 h-max"
                rel="noreferrer"
            >
                <div className="rounded-xl overflow-hidden">
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        className="rounded-xl"
                        src={
                            mode === 'light'
                                ? `/img/landing/demo/${id}.webp`
                                : `/img/landing/demo/${id}-dark.webp`
                        }
                        alt={name}
                    />
                </div>
                <div className="mt-4">
                    <h3 className="text-lg font-bold">{name}</h3>
                </div>
            </motion.div>
        </Link>
    )
}

const Tabs = ({
    selectedTab,
    setSelectedTab,
    tabList,
}: {
    selectedTab: string
    setSelectedTab: (id: string) => void
    tabList: Array<{ id: string; name: string }>
}) => {
    return (
        <div className="flex flex-col gap-2">
            {tabList.map((tab) => (
                <button
                    key={tab.id}
                    className={classNames(
                        'font-semibold px-3 rounded-lg flex items-center w-full whitespace-nowrap gap-x-2 transition-colors duration-150 h-12 ',
                        tab.id === selectedTab
                            ? 'text-primary bg-primary-subtle hover:texy-primary hover:bg-primary-subtle'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-gray-100 dark:hover:bg-gray-700',
                    )}
                    onClick={() => setSelectedTab(tab.id)}
                >
                    <span className="text-2xl">
                        {demoCategoriesIcons[tab.id]}
                    </span>
                    <span>{tab.name}</span>
                </button>
            ))}
        </div>
    )
}

const Demos = ({ mode }: DemoProps) => {
    const [selectedTab, setSelectedTab] = useState('all')
    const t = useTranslations('content')
    const router = useRouter()

    const demoList: Record<
        string,
        {
            id: string
            name: string
            path: string
        }[]
    > = {
        all: allDemos,
        onboarding: accountDemos,
        vacancies: projectDemos,
        chat: aiDemos,
        profile: ecommerceDemos,
        'my-responses': marketingDemos,
        interview: helpCenterDemos,
        settings: authDemos,
    }

    const tabList = [
        {
            id: 'all',
            name: 'All',
        },
        {
            id: 'onboarding',
            name: t('pages.onboarding'),
        },
        {
            id: 'vacancies',
            name: t('pages.vacancies'),
        },
        {
            id: 'chat',
            name: t('pages.chat'),
        },
        {
            id: 'profile',
            name: t('pages.profile'),
        },
        {
            id: 'my-responses',
            name: t('pages.my-responses'),
        },
        {
            id: 'interview',
            name: t('pages.interview'),
        },
        {
            id: 'settings',
            name: t('pages.settings'),
        },
    ]

    const handleSignIn = () => {
        router.push('/sign-in')
    }

    return (
        <div id="demos" className="relative z-20 py-10 md:py-40">
            <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, type: 'spring', bounce: 0.1 }}
                viewport={{ once: true }}
            >
                <motion.h2 className="my-6 text-5xl">{t('title')} </motion.h2>
                <motion.p className="mx-auto max-w-[600px]">
                    {t('sub')}{' '}
                </motion.p>
            </motion.div>
            <Container>
                <div className="flex gap-12">
                    <div className="min-w-[250px] hidden md:block">
                        <Tabs
                            selectedTab={selectedTab}
                            setSelectedTab={setSelectedTab}
                            tabList={tabList}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimatePresence>
                            {(demoList[selectedTab] || []).map((demo) => (
                                <DemoCard
                                    key={demo.id}
                                    id={demo.id}
                                    name={demo.name}
                                    path={demo.path}
                                    mode={mode}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
                <div className="mt-20 text-center">
                    <Button
                        className="inline-flex items-center"
                        onClick={handleSignIn}
                    >
                        {t('button.try-demo')}
                    </Button>
                </div>
            </Container>
        </div>
    )
}

export default Demos
