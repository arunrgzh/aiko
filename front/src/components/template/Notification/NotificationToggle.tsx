import classNames from '@/utils/classNames'
import Badge from '@/components/ui/Badge'
import { PiBellDuotone } from 'react-icons/pi'

const NotificationToggle = ({
    className,
    dot,
}: {
    className?: string
    dot: boolean
}) => {
    return (
        <div
            className={classNames(
                'text-xl md:text-2xl cursor-pointer hover:text-primary-500 transition-colors',
                className,
            )}
        >
            {dot ? (
                <Badge
                    badgeStyle={{
                        top: '2px',
                        right: '4px',
                    }}
                    className="scale-75 md:scale-100 md:top-[3px] md:right-[6px]"
                >
                    <PiBellDuotone />
                </Badge>
            ) : (
                <PiBellDuotone />
            )}
        </div>
    )
}

export default NotificationToggle
