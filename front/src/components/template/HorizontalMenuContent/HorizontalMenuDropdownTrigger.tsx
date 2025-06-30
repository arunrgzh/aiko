import classNames from '@/utils/classNames'
import HorizontalMenuNavLink from './HorizontalMenuNavLink'
import type { CommonProps } from '@/@types/common'
import type { HorizontalMenuNavLinkProps } from './HorizontalMenuNavLink'
import type { ButtonHTMLAttributes, Ref } from 'react'

interface HorizontalMenuDropdownTriggerCommonProps extends CommonProps {
    active?: boolean
}

interface ButtonProps
    extends HorizontalMenuDropdownTriggerCommonProps,
        ButtonHTMLAttributes<HTMLButtonElement> {
    asElement?: 'button'
    ref?: Ref<HTMLButtonElement>
}

interface AnchorProps
    extends HorizontalMenuNavLinkProps,
        HorizontalMenuDropdownTriggerCommonProps {
    asElement?: 'a'
    path: string
    isExternalLink?: boolean
}

type HorizontalMenuDropdownTriggerProps = ButtonProps | AnchorProps

const HorizontalMenuDropdownTrigger = (
    props: HorizontalMenuDropdownTriggerProps,
) => {
    const { className, active, asElement = 'button', ...rest } = props
    const commonProps = {
        className: classNames(
            'font-semibold inline-flex h-11 w-max items-center justify-center rounded-xl bg-background px-6 py-3 text-sm text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-800/50 hover:shadow-sm',
            className,
            active &&
                'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 shadow-sm',
        ),
    }

    if (asElement === 'a') {
        const { path, isExternalLink, ...anchorProps } = rest as AnchorProps
        return (
            <HorizontalMenuNavLink
                path={path as string}
                isExternalLink={isExternalLink}
                {...commonProps}
                {...anchorProps}
            />
        )
    }

    if (asElement === 'button') {
        return (
            <button
                ref={(rest as ButtonProps).ref}
                {...commonProps}
                {...(rest as ButtonProps)}
            />
        )
    }

    return <></>
}

export default HorizontalMenuDropdownTrigger
