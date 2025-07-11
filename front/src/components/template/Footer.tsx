import Container from '@/components/shared/Container'
import classNames from '@/utils/classNames'
import { APP_NAME } from '@/constants/app.constant'
import { PAGE_CONTAINER_GUTTER_X } from '@/constants/theme.constant'
import Link from 'next/link'

export type FooterPageContainerType = 'gutterless' | 'contained'

type FooterProps = {
    pageContainerType: FooterPageContainerType
    className?: string
}

const FooterContent = () => {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between flex-auto w-full gap-4 py-4 md:py-0">
            <span className="text-center md:text-left text-sm md:text-base">
                Copyright &copy; {`${new Date().getFullYear()}`}{' '}
                <span className="font-semibold">{`${APP_NAME}`}</span> All
                rights reserved.
            </span>
            <div className="flex items-center text-sm md:text-base">
                <Link
                    className="text-gray hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    href="/#"
                    onClick={(e) => e.preventDefault()}
                >
                    Term & Conditions
                </Link>
                <span className="mx-2 text-muted"> | </span>
                <Link
                    className="text-gray hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    href="/#"
                    onClick={(e) => e.preventDefault()}
                >
                    Privacy & Policy
                </Link>
            </div>
        </div>
    )
}

export default function Footer({
    pageContainerType = 'contained',
    className,
}: FooterProps) {
    return (
        <footer
            className={classNames(
                'footer flex flex-auto items-center min-h-[4rem] md:h-16',
                PAGE_CONTAINER_GUTTER_X,
                className,
            )}
        >
            {pageContainerType === 'contained' ? (
                <Container>
                    <FooterContent />
                </Container>
            ) : (
                <FooterContent />
            )}
        </footer>
    )
}
