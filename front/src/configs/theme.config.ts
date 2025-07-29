import { THEME_ENUM } from '@/constants/theme.constant'
import { DEFAULT_ACCESSIBILITY_SETTINGS } from '@/constants/accessibility.constant'
import type { Theme } from '@/@types/theme'

/**
 * Since some configurations need to be match with specific themes,
 * we recommend to use the configuration that generated from demo.
 */
export const themeConfig: Theme = {
    themeSchema: THEME_ENUM.THEME_SCHEMA_BLUE,
    direction: THEME_ENUM.DIR_LTR,
    mode: THEME_ENUM.MODE_LIGHT,
    controlSize: THEME_ENUM.CONTROL_SIZE_MD,
    panelExpand: false,
    layout: {
        type: THEME_ENUM.LAYOUT_COLLAPSIBLE_SIDE,
        sideNavCollapse: false,
        previousType: '',
    },
    accessibility: DEFAULT_ACCESSIBILITY_SETTINGS,
}
