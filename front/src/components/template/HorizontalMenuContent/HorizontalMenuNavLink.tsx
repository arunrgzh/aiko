import Link from 'next/link'
import classNames from 'classnames'
import type { CommonProps } from '@/@types/common'
import type { AnchorHTMLAttributes } from 'react'
import { useParams } from 'next/navigation'

export interface HorizontalMenuNavLinkProps
    extends CommonProps,
        AnchorHTMLAttributes<HTMLAnchorElement> {
    path: string
    isExternalLink?: boolean
    className?: string
}
const buildPath = (path: string, params: { id: string }) =>
    path.replace('[id]',params.id);

const HorizontalMenuNavLink = ({
    path,
    children,
    isExternalLink,
    className,
    onClick,
}: HorizontalMenuNavLinkProps) => {
    const params = useParams<{ id: string }>()
    const id = params.id

    const href = buildPath(path, { id })
    return (
        <Link
            className={classNames(
                'w-full flex items-center outline-0',
                className,
            )}
            href={href}
            target={isExternalLink ? '_blank' : ''}
            onClick={onClick}
        >
            {children}
        </Link>
    )
}

export default HorizontalMenuNavLink
