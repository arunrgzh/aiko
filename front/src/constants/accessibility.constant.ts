import type { AccessibilitySettings } from '@/@types/theme'

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
    // Content adjustments
    biggerText: false,
    biggerCursor: false,
    tooltips: false,
    lineHeight: 1.5,
    hideImages: false,
    clearFont: false,
    dyslexicFont: false,
    letterSpacing: 0,
    textMagnifier: false,

    // Color adjustments
    invertColor: false,
    brightness: 100,
    contrast: 100,
    grayscale: false,
    saturation: 100,

    // Navigation
    readingLine: false,
    highlightLinks: false,
    pageRead: false,
}
