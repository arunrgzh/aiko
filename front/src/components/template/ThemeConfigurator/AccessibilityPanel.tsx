'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Switcher from '@/components/ui/Switcher'
// Note: Using HTML range input since Slider component is not available
import useTheme from '@/utils/hooks/useTheme'
import classNames from '@/utils/classNames'
import { DEFAULT_ACCESSIBILITY_SETTINGS } from '@/constants/accessibility.constant'
import { useTranslations } from 'next-intl'
import {
    TbTypography,
    TbPointer,
    TbBulb,
    TbLetterSpacing,
    TbPhotoOff,
    TbAbc,
    TbAccessible,
    TbZoomIn,
    TbAdjustments,
    TbBrightness,
    TbContrast,
    TbPalette,
    TbDroplet,
    TbEye,
    TbHighlight,
    TbVolume,
    TbRefresh,
    TbMinus,
} from 'react-icons/tb'

const AccessibilityPanel = () => {
    const t = useTranslations('accessibility')
    const accessibility =
        useTheme((state) => state.accessibility) ||
        DEFAULT_ACCESSIBILITY_SETTINGS
    const setAccessibility = useTheme((state) => state.setAccessibility)
    const [expandedSection, setExpandedSection] = useState<string | null>(
        'content',
    )

    const resetAllSettings = () => {
        setAccessibility(DEFAULT_ACCESSIBILITY_SETTINGS)
    }

    // Emergency reset with keyboard shortcut (Ctrl + Alt + R)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.altKey && event.key === 'r') {
                event.preventDefault()
                resetAllSettings()
                alert('Accessibility settings reset!')
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [resetAllSettings])

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section)
    }

    const AccessibilityButton = ({
        icon,
        label,
        active,
        onClick,
    }: {
        icon: React.ReactNode
        label: string
        active: boolean
        onClick: () => void
    }) => (
        <button
            onClick={onClick}
            className={classNames(
                'flex flex-col items-center p-3 rounded-lg border transition-all duration-200 text-xs',
                active
                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600',
            )}
        >
            <div className="text-lg mb-1">{icon}</div>
            <span className="text-center leading-tight">{label}</span>
        </button>
    )

    const SliderControl = ({
        label,
        value,
        onChange,
        min,
        max,
        step = 1,
        unit = '',
    }: {
        label: string
        value: number
        onChange: (value: number) => void
        min: number
        max: number
        step?: number
        unit?: string
    }) => {
        const progressPercentage = ((value - min) / (max - min)) * 100

        return (
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label}
                    </span>
                    <span className="text-sm font-semibold px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md min-w-[3rem] text-center">
                        {value}
                        {unit}
                    </span>
                </div>
                <div className="range-slider-container group">
                    <div
                        className="range-slider-progress transition-all duration-200 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                    <input
                        type="range"
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        min={min}
                        max={max}
                        step={step}
                        className="w-full range-slider relative z-10"
                        style={{ background: 'transparent' }}
                        aria-label={`${label}: ${value}${unit}`}
                    />
                </div>
            </div>
        )
    }

    const SectionHeader = ({
        title,
        icon,
        sectionKey,
    }: {
        title: string
        icon: React.ReactNode
        sectionKey: string
    }) => (
        <button
            onClick={() => toggleSection(sectionKey)}
            className="flex items-center justify-between w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
            <div className="flex items-center space-x-2">
                <div className="text-lg">{icon}</div>
                <span className="font-medium text-sm">{title}</span>
            </div>
            <div
                className={classNames(
                    'transform transition-transform duration-200',
                    expandedSection === sectionKey ? 'rotate-180' : '',
                )}
            >
                ▼
            </div>
        </button>
    )

    return (
        <div className="space-y-4">
            {/* Reset button */}
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <Button
                        size="sm"
                        variant="default"
                        onClick={resetAllSettings}
                        icon={<TbRefresh />}
                        className="text-xs accessibility-reset-button"
                    >
                        {t('resetAllSettings')}
                    </Button>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    {t('emergencyReset')}{' '}
                    <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                        Ctrl + Alt + R
                    </kbd>
                </div>
            </div>

            {/* Content Adjustments */}
            <div className="space-y-2">
                <SectionHeader
                    title={t('content.title')}
                    icon={<TbTypography />}
                    sectionKey="content"
                />
                {expandedSection === 'content' && (
                    <div className="space-y-4 p-3 bg-gray-25 dark:bg-gray-900 rounded-lg">
                        <div className="grid grid-cols-3 gap-2">
                            <AccessibilityButton
                                icon={<TbTypography />}
                                label={t('content.biggerText')}
                                active={accessibility.biggerText}
                                onClick={() =>
                                    setAccessibility({
                                        biggerText: !accessibility.biggerText,
                                    })
                                }
                            />
                            <AccessibilityButton
                                icon={<TbPointer />}
                                label={t('content.biggerCursor')}
                                active={accessibility.biggerCursor}
                                onClick={() =>
                                    setAccessibility({
                                        biggerCursor:
                                            !accessibility.biggerCursor,
                                    })
                                }
                            />
                            <AccessibilityButton
                                icon={<TbBulb />}
                                label={t('content.tooltips')}
                                active={accessibility.tooltips}
                                onClick={() =>
                                    setAccessibility({
                                        tooltips: !accessibility.tooltips,
                                    })
                                }
                            />
                            <AccessibilityButton
                                icon={<TbMinus />}
                                label={t('content.lineHeight')}
                                active={accessibility.lineHeight !== 1.5}
                                onClick={() =>
                                    setAccessibility({
                                        lineHeight:
                                            accessibility.lineHeight === 1.5
                                                ? 2.0
                                                : 1.5,
                                    })
                                }
                            />
                            <AccessibilityButton
                                icon={<TbPhotoOff />}
                                label={t('content.hideImages')}
                                active={accessibility.hideImages}
                                onClick={() =>
                                    setAccessibility({
                                        hideImages: !accessibility.hideImages,
                                    })
                                }
                            />
                            <AccessibilityButton
                                icon={<TbAbc />}
                                label={t('content.clearFont')}
                                active={accessibility.clearFont}
                                onClick={() =>
                                    setAccessibility({
                                        clearFont: !accessibility.clearFont,
                                    })
                                }
                            />
                            <AccessibilityButton
                                icon={<TbAccessible />}
                                label={t('content.dyslexicFont')}
                                active={accessibility.dyslexicFont}
                                onClick={() =>
                                    setAccessibility({
                                        dyslexicFont:
                                            !accessibility.dyslexicFont,
                                    })
                                }
                            />
                            <AccessibilityButton
                                icon={<TbLetterSpacing />}
                                label={t('content.letterSpacing')}
                                active={accessibility.letterSpacing > 0}
                                onClick={() =>
                                    setAccessibility({
                                        letterSpacing:
                                            accessibility.letterSpacing > 0
                                                ? 0
                                                : 2,
                                    })
                                }
                            />
                            <AccessibilityButton
                                icon={<TbZoomIn />}
                                label={t('content.textMagnifier')}
                                active={accessibility.textMagnifier}
                                onClick={() =>
                                    setAccessibility({
                                        textMagnifier:
                                            !accessibility.textMagnifier,
                                    })
                                }
                            />
                        </div>

                        {/* Sliders for fine control */}
                        <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <SliderControl
                                label={t('content.lineHeight')}
                                value={accessibility.lineHeight}
                                onChange={(value) =>
                                    setAccessibility({ lineHeight: value })
                                }
                                min={1.0}
                                max={2.0}
                                step={0.1}
                            />
                            <SliderControl
                                label={t('content.letterSpacing')}
                                value={accessibility.letterSpacing}
                                onChange={(value) =>
                                    setAccessibility({ letterSpacing: value })
                                }
                                min={0}
                                max={10}
                                unit="px"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Colors Adjustments */}
            <div className="space-y-2">
                <SectionHeader
                    title={t('colors.title')}
                    icon={<TbPalette />}
                    sectionKey="colors"
                />
                {expandedSection === 'colors' && (
                    <div className="space-y-4 p-3 bg-gray-25 dark:bg-gray-900 rounded-lg">
                        <div className="grid grid-cols-2 gap-2">
                            <AccessibilityButton
                                icon={<TbAdjustments />}
                                label={t('colors.invertColor')}
                                active={accessibility.invertColor}
                                onClick={() =>
                                    setAccessibility({
                                        invertColor: !accessibility.invertColor,
                                    })
                                }
                            />
                            <AccessibilityButton
                                icon={<TbEye />}
                                label={t('colors.grayscale')}
                                active={accessibility.grayscale}
                                onClick={() =>
                                    setAccessibility({
                                        grayscale: !accessibility.grayscale,
                                    })
                                }
                            />
                        </div>
                        <SliderControl
                            label={t('colors.brightness')}
                            value={accessibility.brightness}
                            onChange={(value) =>
                                setAccessibility({ brightness: value })
                            }
                            min={50}
                            max={150}
                            unit="%"
                        />
                        <SliderControl
                            label={t('colors.contrast')}
                            value={accessibility.contrast}
                            onChange={(value) =>
                                setAccessibility({ contrast: value })
                            }
                            min={50}
                            max={150}
                            unit="%"
                        />
                        <SliderControl
                            label={t('colors.saturation')}
                            value={accessibility.saturation}
                            onChange={(value) =>
                                setAccessibility({ saturation: value })
                            }
                            min={0}
                            max={200}
                            unit="%"
                        />
                    </div>
                )}
            </div>

            {/* Navigation Tools */}
            <div className="space-y-2">
                <SectionHeader
                    title={t('navigation.title')}
                    icon={<TbHighlight />}
                    sectionKey="navigation"
                />
                {expandedSection === 'navigation' && (
                    <div className="space-y-4 p-3 bg-gray-25 dark:bg-gray-900 rounded-lg">
                        <div className="grid grid-cols-3 gap-2">
                            <AccessibilityButton
                                icon={<TbMinus />}
                                label={t('navigation.readingLine')}
                                active={accessibility.readingLine}
                                onClick={() =>
                                    setAccessibility({
                                        readingLine: !accessibility.readingLine,
                                    })
                                }
                            />
                            <AccessibilityButton
                                icon={<TbHighlight />}
                                label={t('navigation.highlightLinks')}
                                active={accessibility.highlightLinks}
                                onClick={() =>
                                    setAccessibility({
                                        highlightLinks:
                                            !accessibility.highlightLinks,
                                    })
                                }
                            />
                            <AccessibilityButton
                                icon={<TbVolume />}
                                label={t('navigation.pageRead')}
                                active={accessibility.pageRead}
                                onClick={() =>
                                    setAccessibility({
                                        pageRead: !accessibility.pageRead,
                                    })
                                }
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AccessibilityPanel
