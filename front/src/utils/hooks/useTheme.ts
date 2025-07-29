'use client'

import { useContext } from 'react'
import ThemeContext from '@/components/template/Theme/ThemeContext'
import { MODE_DARK, MODE_LIGHT } from '@/constants/theme.constant'
import presetThemeSchemaConfig from '@/configs/preset-theme-schema.config'
import applyTheme from '@/utils/applyThemeSchema'
import {
    applyAccessibilitySettings,
    enableReadingLine,
    disableReadingLine,
} from '@/utils/applyAccessibilitySettings'
import { DEFAULT_ACCESSIBILITY_SETTINGS } from '@/constants/accessibility.constant'
import type {
    Mode,
    Direction,
    LayoutType,
    Theme,
    AccessibilitySettings,
} from '@/@types/theme'

type UseThemeReturnType = {
    setSchema: (schema: string) => void
    setMode: (mode: Mode) => void
    setSideNavCollapse: (sideNavCollapse: boolean) => void
    setDirection: (direction: Direction) => void
    setPanelExpand: (panelExpand: boolean) => void
    setLayout: (layout: LayoutType) => void
    setAccessibility: (accessibility: Partial<AccessibilitySettings>) => void
} & Theme

const useTheme = <T>(selector: (state: UseThemeReturnType) => T): T => {
    const context = useContext(ThemeContext)

    if (context === undefined) {
        throw new Error('useTheme must be used under a ThemeProvider')
    }

    const getThemeState = () => ({
        ...context.theme,
        setSchema: (themeSchema: string) => {
            context.setTheme((prevTheme) => ({ ...prevTheme, themeSchema }))
            applyTheme(themeSchema, context.theme.mode, presetThemeSchemaConfig)
        },

        setMode: (mode: Mode) => {
            context.setTheme((prevTheme) => ({ ...prevTheme, mode }))
            const root = window.document.documentElement
            const isEnabled = mode === MODE_DARK
            root.classList.remove(isEnabled ? MODE_LIGHT : MODE_DARK)
            root.classList.add(isEnabled ? MODE_DARK : MODE_LIGHT)
        },
        setSideNavCollapse: (sideNavCollapse: boolean) => {
            context.setTheme((prevTheme) => ({
                ...prevTheme,
                layout: { ...prevTheme.layout, sideNavCollapse },
            }))
        },
        setDirection: (direction: Direction) => {
            context.setTheme((prevTheme) => ({ ...prevTheme, direction }))
            const root = window.document.documentElement
            root.setAttribute('dir', direction)
        },
        setPanelExpand: (panelExpand: boolean) => {
            context.setTheme((prevTheme) => ({ ...prevTheme, panelExpand }))
        },
        setLayout: (layout: LayoutType) => {
            context.setTheme((prevTheme) => ({
                ...prevTheme,
                layout: { ...prevTheme.layout, type: layout },
            }))
        },
        setAccessibility: (accessibility: Partial<AccessibilitySettings>) => {
            const currentAccessibility =
                context.theme.accessibility || DEFAULT_ACCESSIBILITY_SETTINGS

            const newAccessibility = {
                ...currentAccessibility,
                ...accessibility,
            }

            context.setTheme((prevTheme) => ({
                ...prevTheme,
                accessibility: newAccessibility,
            }))

            // Apply accessibility settings to DOM
            applyAccessibilitySettings(newAccessibility)

            // Handle reading line separately
            if (accessibility.readingLine !== undefined) {
                if (accessibility.readingLine) {
                    enableReadingLine()
                } else {
                    disableReadingLine()
                }
            }
        },
    })

    const themeState = getThemeState()

    return selector(themeState)
}

export default useTheme
