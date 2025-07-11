import classNames from 'classnames'
import { CommonProps } from '@/@types/common'
import type { ElementType, Ref } from 'react'

interface ContainerProps extends CommonProps {
    asElement?: ElementType
    ref?: Ref<HTMLElement>
}

const Container = (props: ContainerProps) => {
    const {
        className,
        children,
        asElement: Component = 'div',
        ref,
        ...rest
    } = props

    return (
        <Component
            ref={ref}
            className={classNames(
                'container mx-auto px-4 md:px-6 lg:px-8 max-w-[1400px]',
                className,
            )}
            {...rest}
        >
            {children}
        </Component>
    )
}

export default Container
