import type { AccessibilitySettings } from '@/@types/theme'

const ACCESSIBILITY_ROOT_CLASS = 'accessibility-root'
const ACCESSIBILITY_STYLES_ID = 'accessibility-styles'

export const applyAccessibilitySettings = (settings: AccessibilitySettings) => {
    const root = document.documentElement
    const body = document.body

    // Remove existing accessibility classes
    root.classList.remove(
        'accessibility-bigger-text',
        'accessibility-bigger-cursor',
        'accessibility-hide-images',
        'accessibility-clear-font',
        'accessibility-dyslexic-font',
        'accessibility-text-magnifier',
        'accessibility-invert-color',
        'accessibility-grayscale',
        'accessibility-reading-line',
        'accessibility-highlight-links',
    )

    // Apply accessibility classes
    if (settings.biggerText) root.classList.add('accessibility-bigger-text')
    if (settings.biggerCursor) root.classList.add('accessibility-bigger-cursor')
    if (settings.hideImages) root.classList.add('accessibility-hide-images')
    if (settings.clearFont) root.classList.add('accessibility-clear-font')
    if (settings.dyslexicFont) root.classList.add('accessibility-dyslexic-font')
    if (settings.textMagnifier)
        root.classList.add('accessibility-text-magnifier')
    if (settings.invertColor) root.classList.add('accessibility-invert-color')
    if (settings.grayscale) root.classList.add('accessibility-grayscale')
    if (settings.readingLine) root.classList.add('accessibility-reading-line')
    if (settings.highlightLinks)
        root.classList.add('accessibility-highlight-links')

    // Create or update dynamic styles
    let styleEl = document.getElementById(
        ACCESSIBILITY_STYLES_ID,
    ) as HTMLStyleElement
    if (!styleEl) {
        styleEl = document.createElement('style')
        styleEl.id = ACCESSIBILITY_STYLES_ID
        document.head.appendChild(styleEl)
    }

    // Generate CSS based on settings
    const styles = generateAccessibilityCSS(settings)
    styleEl.textContent = styles

    // Handle tooltips
    if (settings.tooltips) {
        enableTooltips()
    } else {
        disableTooltips()
    }

    // Handle page read
    if (settings.pageRead) {
        enablePageRead()
    } else {
        disablePageRead()
    }
}

const generateAccessibilityCSS = (settings: AccessibilitySettings): string => {
    const styles: string[] = []

    // Bigger text
    if (settings.biggerText) {
        styles.push(`
            .accessibility-bigger-text {
                font-size: 150% !important;
            }
            .accessibility-bigger-text * {
                font-size: inherit !important;
                line-height: 1.3 !important;
            }
            .accessibility-bigger-text .text-xs {
                font-size: 0.8rem !important;
            }
            .accessibility-bigger-text .text-sm {
                font-size: 0.9rem !important;
            }
            .accessibility-bigger-text .text-base {
                font-size: 1.1rem !important;
            }
            .accessibility-bigger-text .text-lg {
                font-size: 1.25rem !important;
            }
            .accessibility-bigger-text .text-xl {
                font-size: 1.4rem !important;
            }
            /* Keep reset button always accessible */
            .accessibility-bigger-text .accessibility-reset-button {
                font-size: 0.75rem !important;
                padding: 0.25rem 0.5rem !important;
                position: relative !important;
                z-index: 9999 !important;
            }
        `)
    }

    // Bigger cursor
    if (settings.biggerCursor) {
        styles.push(`
            .accessibility-bigger-cursor,
            .accessibility-bigger-cursor * {
                cursor: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUgNUwyNyAyN00yNyA1TDUgMjciIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMyIvPgo8L3N2Zz4K'), auto !important;
            }
        `)
    }

    // Line height
    if (settings.lineHeight !== 1.5) {
        styles.push(`
            * {
                line-height: ${settings.lineHeight} !important;
            }
        `)
    }

    // Letter spacing
    if (settings.letterSpacing > 0) {
        styles.push(`
            * {
                letter-spacing: ${settings.letterSpacing}px !important;
            }
        `)
    }

    // Hide images
    if (settings.hideImages) {
        styles.push(`
            .accessibility-hide-images img,
            .accessibility-hide-images video,
            .accessibility-hide-images [style*="background-image"] {
                opacity: 0.1 !important;
                filter: blur(2px) !important;
            }
        `)
    }

    // Clear font
    if (settings.clearFont) {
        styles.push(`
            .accessibility-clear-font * {
                font-family: 'Arial', 'Helvetica', sans-serif !important;
                font-weight: 400 !important;
                text-decoration: none !important;
            }
        `)
    }

    // Dyslexic font
    if (settings.dyslexicFont) {
        styles.push(`
            .accessibility-dyslexic-font * {
                font-family: 'OpenDyslexic', 'Comic Sans MS', 'Arial', sans-serif !important;
            }
        `)
    }

    // Color adjustments
    const filters: string[] = []

    if (settings.brightness !== 100) {
        filters.push(`brightness(${settings.brightness}%)`)
    }

    if (settings.contrast !== 100) {
        filters.push(`contrast(${settings.contrast}%)`)
    }

    if (settings.saturation !== 100) {
        filters.push(`saturate(${settings.saturation}%)`)
    }

    if (settings.invertColor) {
        filters.push('invert(1)')
    }

    if (settings.grayscale) {
        filters.push('grayscale(1)')
    }

    if (filters.length > 0) {
        styles.push(`
            html {
                filter: ${filters.join(' ')} !important;
            }
        `)
    }

    // Highlight links
    if (settings.highlightLinks) {
        styles.push(`
            .accessibility-highlight-links a,
            .accessibility-highlight-links button,
            .accessibility-highlight-links [role="button"] {
                outline: 3px solid #ff0 !important;
                outline-offset: 2px !important;
                background-color: rgba(255, 255, 0, 0.2) !important;
            }
        `)
    }

    // Reading line
    if (settings.readingLine) {
        styles.push(`
            .accessibility-reading-line::after {
                content: '';
                position: fixed;
                top: var(--reading-line-top, 50%);
                left: 0;
                right: 0;
                height: 2px;
                background: #ff0;
                z-index: 9999;
                pointer-events: none;
                box-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
            }
        `)
    }

    return styles.join('\n')
}

const enableTooltips = () => {
    // Add aria-labels as visible tooltips
    document.querySelectorAll('[aria-label], [title]').forEach((el) => {
        const text =
            (el as HTMLElement).getAttribute('aria-label') ||
            (el as HTMLElement).getAttribute('title')
        if (text && !el.querySelector('.accessibility-tooltip')) {
            const tooltip = document.createElement('div')
            tooltip.className = 'accessibility-tooltip'
            tooltip.textContent = text
            tooltip.style.cssText = `
                position: absolute;
                background: #000;
                color: #fff;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 10000;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.2s;
                top: -30px;
                left: 50%;
                transform: translateX(-50%);
            `
            el.appendChild(tooltip)

            el.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1'
            })

            el.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0'
            })
        }
    })
}

const disableTooltips = () => {
    document.querySelectorAll('.accessibility-tooltip').forEach((el) => {
        el.remove()
    })
}

let readingLineActive = false
let readingLineHandler: ((e: MouseEvent) => void) | null = null

const enablePageRead = () => {
    if ('speechSynthesis' in window && !readingLineActive) {
        readingLineActive = true

        // Add click listener to read text
        readingLineHandler = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const text = target.textContent || target.innerText

            if (text && text.trim()) {
                // Stop any current speech
                speechSynthesis.cancel()

                // Create and speak utterance
                const utterance = new SpeechSynthesisUtterance(text.trim())
                utterance.rate = 0.8
                utterance.pitch = 1
                utterance.volume = 0.8

                speechSynthesis.speak(utterance)
            }
        }

        document.addEventListener('click', readingLineHandler)
    }
}

const disablePageRead = () => {
    if (readingLineActive) {
        readingLineActive = false
        speechSynthesis.cancel()

        if (readingLineHandler) {
            document.removeEventListener('click', readingLineHandler)
            readingLineHandler = null
        }
    }
}

// Reading line mouse tracking
let readingLineMouseHandler: ((e: MouseEvent) => void) | null = null

export const enableReadingLine = () => {
    readingLineMouseHandler = (e: MouseEvent) => {
        document.documentElement.style.setProperty(
            '--reading-line-top',
            `${e.clientY}px`,
        )
    }
    document.addEventListener('mousemove', readingLineMouseHandler)
}

export const disableReadingLine = () => {
    if (readingLineMouseHandler) {
        document.removeEventListener('mousemove', readingLineMouseHandler)
        readingLineMouseHandler = null
    }
}
