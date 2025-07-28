'use client'
import { useState } from 'react'
import ThemeContext from './ThemeContext'
import ConfigProvider from '@/components/ui/ConfigProvider'
import appConfig from '@/configs/app.config'
import applyTheme from '@/utils/applyThemeSchema'
import presetThemeSchemaConfig from '@/configs/preset-theme-schema.config'
import type { Theme } from '@/@types/theme'
import type { CommonProps } from '@/@types/common'

interface ThemeProviderProps extends CommonProps {
    theme: Theme
    locale?: string
}

const ThemeProvider = ({ children, theme, locale }: ThemeProviderProps) => {
    const [themeState, setThemeState] = useState<Theme>(theme)

    const handleSetTheme = async (payload: (param: Theme) => Theme | Theme) => {
        const setTheme = async (theme: Theme) => {
            setThemeState(theme)
            // Set cookie on client side instead of server action
            if (typeof window !== 'undefined') {
                document.cookie = `theme=${JSON.stringify({ state: theme })}; path=/; max-age=${60 * 60 * 24 * 365}` // 1 year
            }
        }

        if (typeof payload === 'function') {
            const nextTheme = payload(themeState)
            await setTheme(nextTheme)
        } else {
            await setTheme(payload)
        }
    }

    return (
        <ThemeContext.Provider
            value={{
                theme: themeState,
                setTheme: handleSetTheme,
            }}
        >
            <ConfigProvider
                value={{
                    ...theme,
                    locale: locale || appConfig.locale,
                }}
            >
                {children}
            </ConfigProvider>
            <script
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: `(${applyTheme.toString()})(${JSON.stringify([
                        theme.themeSchema || 'default',
                        theme.mode,
                        presetThemeSchemaConfig,
                    ]).slice(1, -1)})`,
                }}
            />
        </ThemeContext.Provider>
    )
}

export default ThemeProvider
