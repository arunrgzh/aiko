import ModeSwitcher from './ModeSwitcher'
import LayoutSwitcher from './LayoutSwitcher'
import ThemeSwitcher from './ThemeSwitcher'
import DirectionSwitcher from './DirectionSwitcher'
import CopyButton from './CopyButton'
import AccessibilityPanel from './AccessibilityPanel'
import ScrollBar from '@/components/ui/ScrollBar'
import { useTranslations } from 'next-intl'

export type ThemeConfiguratorProps = {
    callBackClose?: () => void
}

const ThemeConfigurator = ({ callBackClose }: ThemeConfiguratorProps) => {
    const t = useTranslations('themeConfig')

    return (
        <div className="flex flex-col h-full justify-between">
            <ScrollBar className="flex-1">
                <div className="flex flex-col gap-y-6 md:gap-y-10 p-4 md:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h6 className="text-sm md:text-base">
                                {t('darkMode.title')}
                            </h6>
                            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                                {t('darkMode.description')}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h6 className="text-sm md:text-base">
                                {t('direction.title')}
                            </h6>
                            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                                {t('direction.description')}
                            </span>
                        </div>
                        <DirectionSwitcher callBackClose={callBackClose} />
                    </div>
                    <div>
                        <h6 className="mb-2 md:mb-3 text-sm md:text-base">
                            {t('theme.title')}
                        </h6>
                        <ThemeSwitcher />
                    </div>
                    <div>
                        <AccessibilityPanel />
                    </div>
                </div>
            </ScrollBar>
            <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700">
                <CopyButton />
            </div>
        </div>
    )
}

export default ThemeConfigurator
