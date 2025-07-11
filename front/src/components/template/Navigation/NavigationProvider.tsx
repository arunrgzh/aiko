'use client'

import { useState } from 'react'
import NavigationContext from './NavigationContext'
import type { NavigationTree } from '@/@types/navigation'
import type { CommonProps } from '@/@types/common'

interface NavigationProviderProps extends CommonProps {
    navigationTree: NavigationTree[]
    initialRouteKey?: string
    initialCollapsed?: boolean
}

const NavigationProvider = ({
    navigationTree,
    initialRouteKey = '',
    initialCollapsed = false,
    children,
}: NavigationProviderProps) => {
    const [currentRouteKey, setCurrentRouteKey] = useState(initialRouteKey)
    const [isCollapsed, setIsCollapsed] = useState(initialCollapsed)

    return (
        <NavigationContext.Provider
            value={{
                navigationTree,
                currentRouteKey,
                setCurrentRouteKey,
                isCollapsed,
                setIsCollapsed,
            }}
        >
            {children}
        </NavigationContext.Provider>
    )
}

export default NavigationProvider
