import { ReactNode } from 'react'
import Simple from '@/components/layouts/AuthLayout/Simple'

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex flex-auto flex-col h-[100vh]">
            <Simple>{children}</Simple>
        </div>
    )
}

export default Layout
