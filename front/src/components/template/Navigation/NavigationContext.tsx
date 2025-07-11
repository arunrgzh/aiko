'use client'

import { createContext, useContext } from 'react'
import type { NavigationTree } from '@/@types/navigation'

interface NavigationContextProps {
    navigationTree: NavigationTree[]
    currentRouteKey?: string
    setCurrentRouteKey?: (key: string) => void
    isCollapsed?: boolean
    setIsCollapsed?: (collapsed: boolean) => void
}

const NavigationContext = createContext<NavigationContextProps>({
    navigationTree: [],
    currentRouteKey: '',
    setCurrentRouteKey: () => {},
    isCollapsed: false,
    setIsCollapsed: () => {},
})

export const useNavigationContext = () => useContext(NavigationContext)

export default NavigationContext
