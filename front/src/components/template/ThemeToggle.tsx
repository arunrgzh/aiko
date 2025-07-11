'use client'

import { PiSunDuotone, PiMoonStarsDuotone } from 'react-icons/pi'
import useTheme from '@/utils/hooks/useTheme'
import { MODE_DARK, MODE_LIGHT } from '@/constants/theme.constant'
import type { CommonProps } from '@/@types/common'

interface ThemeToggleProps extends CommonProps {
    className?: string
}

const ThemeToggle = ({ className }: ThemeToggleProps) => {
    const mode = useTheme((state) => state.mode)
    const setMode = useTheme((state) => state.setMode)

    const toggleMode = () => {
        setMode(mode === MODE_LIGHT ? MODE_DARK : MODE_LIGHT)
    }

    return (
        <div
            className={className}
            role="button"
            onClick={toggleMode}
            aria-label="Toggle dark mode"
        >
            {mode === MODE_LIGHT ? (
                <PiMoonStarsDuotone className="text-2xl hover:text-primary-500 transition-colors" />
            ) : (
                <PiSunDuotone className="text-2xl hover:text-primary-500 transition-colors" />
            )}
        </div>
    )
}

export default ThemeToggle
