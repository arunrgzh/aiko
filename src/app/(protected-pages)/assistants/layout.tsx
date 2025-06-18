import React from 'react'
import { ReactNode } from 'react'
import AssistantsLayout from '@/components/layouts/AssistantsLayout'

const Layout = async ({ children }: { children: ReactNode }) => {
    return <AssistantsLayout>{children}</AssistantsLayout>
}

export default Layout
