'use client'

import classNames from '@/utils/classNames'
import Card from '@/components/ui/Card'
import type { CardProps } from '@/components/ui/Card'

type AdaptableCardProps = CardProps

const AdaptiveCard = (props: AdaptableCardProps) => {
    const { className, bodyClass, ...rest } = props

    return (
        <Card
            className={classNames(
                className
            )}
            bodyClass={classNames(bodyClass)}
            {...rest}
        />
    )
}

export default AdaptiveCard
