export type Direction = 'ltr' | 'rtl'
export type Mode = 'light' | 'dark'
export type ControlSize = 'lg' | 'md' | 'sm'
export type LayoutType =
    | 'blank'
    | 'collapsibleSide'
    | 'stackedSide'
    | 'topBarClassic'
    | 'framelessSide'
    | 'contentOverlay'

export type AccessibilitySettings = {
    // Content adjustments
    biggerText: boolean
    biggerCursor: boolean
    tooltips: boolean
    lineHeight: number // 1.0 to 2.0
    hideImages: boolean
    clearFont: boolean
    dyslexicFont: boolean
    letterSpacing: number // 0 to 10px
    textMagnifier: boolean

    // Color adjustments
    invertColor: boolean
    brightness: number // 50 to 150
    contrast: number // 50 to 150
    grayscale: boolean
    saturation: number // 0 to 200

    // Navigation
    readingLine: boolean
    highlightLinks: boolean
    pageRead: boolean
}

export type Theme = {
    themeSchema: string
    direction: Direction
    mode: Mode
    panelExpand: boolean
    controlSize: ControlSize
    layout: {
        type: LayoutType
        sideNavCollapse: boolean
        previousType?: LayoutType | ''
    }
    accessibility?: AccessibilitySettings
}
