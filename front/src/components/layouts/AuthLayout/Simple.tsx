import { cloneElement } from 'react'
import Container from '@/components/shared/Container'
import LanguageSelector from '@/components/template/LanguageSelector'
import type { ReactNode, ReactElement } from 'react'
import type { CommonProps } from '@/@types/common'

interface SimpleProps extends CommonProps {
    content?: ReactNode
}

const Simple = ({ children, content, ...rest }: SimpleProps) => {
    return (
        <div className="h-full bg-white dark:bg-gray-800">
            <Container className="flex flex-col flex-auto items-center justify-center min-w-0 h-full">
                <div className="min-w-[320px] md:min-w-[400px] max-w-[400px]">
                    <div className="relative">
                        {/* Language Selector positioned in top right */}
                        <div className="absolute top-0 right-0 z-10">
                            <LanguageSelector />
                        </div>
                        {content}
                        {children
                            ? cloneElement(children as ReactElement, {
                                  ...rest,
                              })
                            : null}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Simple
