import ModeSwitcher from './ModeSwitcher'
import LayoutSwitcher from './LayoutSwitcher'
import ThemeSwitcher from './ThemeSwitcher'
import DirectionSwitcher from './DirectionSwitcher'
import CopyButton from './CopyButton'
import ScrollBar from '@/components/ui/ScrollBar'

export type ThemeConfiguratorProps = {
    callBackClose?: () => void
}

const ThemeConfigurator = ({ callBackClose }: ThemeConfiguratorProps) => {
    return (
        <div className="flex flex-col h-full justify-between">
            <ScrollBar className="flex-1">
                <div className="flex flex-col gap-y-6 md:gap-y-10 p-4 md:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h6 className="text-sm md:text-base">Dark Mode</h6>
                            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                                Switch theme to dark mode
                            </span>
                        </div>
                        <ModeSwitcher />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h6 className="text-sm md:text-base">Direction</h6>
                            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                                Select a direction
                            </span>
                        </div>
                        <DirectionSwitcher callBackClose={callBackClose} />
                    </div>
                    <div>
                        <h6 className="mb-2 md:mb-3 text-sm md:text-base">
                            Theme
                        </h6>
                        <ThemeSwitcher />
                    </div>
                    <div>
                        <h6 className="mb-2 md:mb-3 text-sm md:text-base">
                            Layout
                        </h6>
                        <LayoutSwitcher />
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
