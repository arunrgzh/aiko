import { ReactNode } from 'react'
import AuthLayout from '@/components/layouts/AuthLayout/AuthLayout'

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex flex-auto flex-col h-[100vh]">
            <AuthLayout>{children}</AuthLayout>
        </div>
    )
}

export default Layout
