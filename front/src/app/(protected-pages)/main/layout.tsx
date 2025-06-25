import React from 'react'
import { ReactNode } from 'react'
import Container from '@/components/shared/Container'
import DashboardLayout from '@/components/layouts/DashboardLayout'

const Layout = async ({ children }: { children: ReactNode }) => {
    return (
            <DashboardLayout>
                <Container className={'py-3'}>{children}</Container>
            </DashboardLayout>
    )
}

export default Layout
