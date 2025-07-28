'use client'

import HeroContent from './HeroContent'
import NavigationBar from './NavigationBar'
import Features from './Features'
import Demos from './Demos'
import TechStack from './TechStack'
import OtherFeatures from './OtherFeatures'
import LandingFooter from './LandingFooter'
import LanguageSelector from '@/components/template/LanguageSelector'
import useTheme from '@/utils/hooks/useTheme'
import { MODE_DARK, MODE_LIGHT } from '@/constants/theme.constant'
// import Components from './Components'

const Landing = () => {
    const mode = useTheme((state) => state.mode)
    const setMode = useTheme((state) => state.setMode)
    const schema = useTheme((state) => state.themeSchema)
    const setSchema = useTheme((state) => state.setSchema)

    const toggleMode = () => {
        setMode(mode === MODE_LIGHT ? MODE_DARK : MODE_LIGHT)
    }

    return (
        <main className="px-4 lg:px-0 text-base bg-white dark:bg-gray-900">
            <NavigationBar toggleMode={toggleMode} mode={mode} />

            {/* Language Selector positioned in top right, above navigation */}
            <div className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-700">
                <LanguageSelector />
            </div>

            <div className="relative">
                <div
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='50' height='50' fill='none' stroke='${mode === MODE_LIGHT ? 'rgb(0 0 0 / 0.04)' : 'rgb(255 255 255 / 0.04)'}'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
                    }}
                    className="absolute inset-0 [mask-image:linear-gradient(to_bottom,white_5%,transparent_70%)] pointer-events-none select-none"
                ></div>
                <HeroContent mode={mode} />
            </div>
            <Features
                mode={mode}
                schema={schema}
                setSchema={setSchema}
                onModeChange={(value) => setMode(value ? 'dark' : 'light')}
            />
            <TechStack />
            <OtherFeatures />
            <Demos mode={mode} />
            <LandingFooter mode={mode} />
        </main>
    )
}

export default Landing
