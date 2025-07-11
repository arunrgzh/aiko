'use client'

import { Suspense } from 'react'
import Container from '@/components/shared/Container'
import Footer from './Footer'
import useLayout from '@/utils/hooks/useLayout'
import classNames from '@/utils/classNames'
import {
    PAGE_CONTAINER_GUTTER_X,
    PAGE_CONTAINER_GUTTER_Y,
} from '@/constants/theme.constant'
import type { CommonProps } from '@/@types/common'
import type { Meta, PageHeaderProps } from '@/@types/routes'
import type { FooterPageContainerType } from './Footer'
import type { ReactNode, ElementType, ComponentPropsWithRef } from 'react'

export interface PageContainerProps extends CommonProps, Meta {
    contained?: boolean
}

type PageContainerHeaderProps = PageHeaderProps & {
    className?: string
    gutterLess?: boolean
    customeHeader?: () => ReactNode
}

interface PageContainerBodyProps {
    className?: string
    pageContainerType?: string
    children: React.ReactNode
}

interface PageContainerFooterProps {
    className?: string
    footer?: boolean
    pageContainerType: FooterPageContainerType
}

const CustomHeader = <T extends ElementType>({
    header,
    ...props
}: {
    header: T
} & ComponentPropsWithRef<T>) => {
    const Header = header
    return <Header {...props} />
}

export const PageContainerHeader = ({
    title,
    contained,
    extraHeader,
    customeHeader,
    gutterLess,
    className,
}: PageContainerHeaderProps) => {
    if (!title && !extraHeader) return null

    return (
        <div
            className={classNames(
                contained && 'container mx-auto px-4 md:px-6',
                'flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4',
                gutterLess && 'mt-4',
                className,
            )}
        >
            <div>
                {title &&
                    typeof title === 'string' &&
                    (customeHeader ? (
                        customeHeader()
                    ) : (
                        <h3 className="font-bold text-xl md:text-2xl">
                            {title}
                        </h3>
                    ))}
                <Suspense fallback={<></>}>
                    {title && typeof title !== 'string' && (
                        <CustomHeader header={title} />
                    )}
                </Suspense>
            </div>
            <div className="flex-shrink-0">
                <Suspense fallback={<></>}>
                    {extraHeader && typeof extraHeader !== 'string' && (
                        <CustomHeader header={extraHeader} />
                    )}
                </Suspense>
            </div>
        </div>
    )
}

export const PageContainerBody = ({
    pageContainerType,
    children,
    className,
}: PageContainerBodyProps) => {
    return pageContainerType === 'contained' ? (
        <Container className={classNames('h-full px-4 md:px-6', className)}>
            {children}
        </Container>
    ) : (
        <div className="px-4 md:px-6">{children}</div>
    )
}

export const PageContainerFooter = ({
    footer,
    pageContainerType,
    className,
}: PageContainerFooterProps) => {
    if (!footer) return null

    return (
        <Footer
            className={classNames('mt-auto', className)}
            pageContainerType={pageContainerType}
        />
    )
}

const PageContainer = (props: PageContainerProps) => {
    const {
        pageContainerType = 'default',
        pageBackgroundType = 'default',
        children,
        header,
        footer = true,
    } = props

    const { pageContainerReassemble } = useLayout()

    const defaultClass = 'h-full flex flex-auto flex-col justify-between'
    const pageContainerDefaultClass =
        'page-container relative h-full flex flex-auto flex-col overflow-hidden'
    const pageContainerGutterClass = `${PAGE_CONTAINER_GUTTER_X} ${PAGE_CONTAINER_GUTTER_Y}`

    return (
        <>
            {pageContainerReassemble ? (
                pageContainerReassemble({
                    pageContainerType,
                    pageBackgroundType,
                    pageContainerGutterClass,
                    children,
                    footer,
                    header,
                    defaultClass,
                    pageContainerDefaultClass,
                    PageContainerBody,
                    PageContainerFooter,
                    PageContainerHeader,
                })
            ) : (
                <div
                    className={classNames(
                        defaultClass,
                        pageBackgroundType === 'plain' &&
                            'bg-white dark:bg-gray-900',
                    )}
                >
                    <main className="h-full flex flex-col">
                        <div
                            className={classNames(
                                pageContainerDefaultClass,
                                pageContainerType !== 'gutterless' &&
                                    pageContainerGutterClass,
                                pageContainerType === 'contained' &&
                                    'container mx-auto',
                                !footer && 'pb-0',
                            )}
                        >
                            <PageContainerHeader
                                {...header}
                                gutterLess={pageContainerType === 'gutterless'}
                            />
                            <PageContainerBody
                                pageContainerType={pageContainerType}
                                className="flex-1"
                            >
                                {children}
                            </PageContainerBody>
                        </div>
                    </main>
                    <PageContainerFooter
                        footer={footer}
                        pageContainerType={
                            pageContainerType as FooterPageContainerType
                        }
                    />
                </div>
            )}
        </>
    )
}

export default PageContainer
