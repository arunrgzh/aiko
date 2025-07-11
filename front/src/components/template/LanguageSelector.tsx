'use client'

import { useMemo } from 'react'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import classNames from 'classnames'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import { HiCheck } from 'react-icons/hi'
import { setLocale } from '@/server/actions/locale'
import { useLocale } from 'next-intl'
import type { CommonProps } from '@/@types/common'

const languageList = [
    { label: 'English', value: 'en', flag: 'US' },
    { label: 'Chinese', value: 'zh', flag: 'CN' },
    { label: 'Espanol', value: 'es', flag: 'ES' },
    { label: 'Arabic', value: 'ar', flag: 'SA' },
    { label: 'Russian', value: 'ru', flag: 'RU' },
]

const _LanguageSelector = ({ className }: CommonProps) => {
    const locale = useLocale()

    const selectLangFlag = useMemo(() => {
        return languageList.find((lang) => lang.value === locale)?.flag
    }, [locale])

    const handleUpdateLocale = async (locale: string) => {
        await setLocale(locale)
    }

    const selectedLanguage = (
        <div
            className={classNames(
                className,
                'flex items-center cursor-pointer',
            )}
        >
            <Avatar
                size={20}
                className="w-5 h-5 md:w-6 md:h-6"
                shape="circle"
                src={`/img/countries/${selectLangFlag}.png`}
            />
        </div>
    )

    return (
        <Dropdown
            renderTitle={selectedLanguage}
            placement="bottom-end"
            menuClass="min-w-[150px] md:min-w-[180px]"
        >
            {languageList.map((lang) => (
                <Dropdown.Item
                    key={lang.label}
                    className="justify-between py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                    eventKey={lang.label}
                    onClick={() => handleUpdateLocale(lang.value)}
                >
                    <span className="flex items-center">
                        <Avatar
                            size={16}
                            className="w-4 h-4 md:w-[18px] md:h-[18px]"
                            shape="circle"
                            src={`/img/countries/${lang.flag}.png`}
                        />
                        <span className="ltr:ml-2 rtl:mr-2 text-sm md:text-base">
                            {lang.label}
                        </span>
                    </span>
                    {locale === lang.value && (
                        <HiCheck className="text-emerald-500 text-base md:text-lg" />
                    )}
                </Dropdown.Item>
            ))}
        </Dropdown>
    )
}

const LanguageSelector = withHeaderItem(_LanguageSelector)

export default LanguageSelector
