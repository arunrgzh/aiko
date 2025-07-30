import { useMemo, lazy, type JSX } from 'react'
import type { CommonProps } from '@/@types/common'
import type { LazyExoticComponent } from 'react'
import LanguageSelector from '@/components/template/LanguageSelector'
import SidePanel from '@/components/template/SidePanel/SidePanel'

type LayoutType = 'simple' | 'split' | 'side'

type Layouts = Record<
    LayoutType,
    LazyExoticComponent<<T extends CommonProps>(props: T) => JSX.Element>
>

const currentLayoutType: LayoutType = 'side'

const layouts: Layouts = {
    simple: lazy(() => import('./Simple')),
    split: lazy(() => import('./Split')),
    side: lazy(() => import('./Side')),
}

const AuthLayout = ({ children }: CommonProps) => {
    const Layout = useMemo(() => {
        return layouts[currentLayoutType]
    }, [])

    return (
        <>
            <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
                <SidePanel />
                <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-700">
                    <LanguageSelector />
                </div>
            </div>
            <Layout>{children}</Layout>
        </>
    )
}

export default AuthLayout
