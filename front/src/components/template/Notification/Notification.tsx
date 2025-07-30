'use client'

import { useEffect, useState, useRef } from 'react'
import classNames from 'classnames'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import Dropdown from '@/components/ui/Dropdown'
import ScrollBar from '@/components/ui/ScrollBar'
import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Tooltip from '@/components/ui/Tooltip'
import NotificationAvatar from './NotificationAvatar'
import NotificationToggle from './NotificationToggle'
import { HiOutlineMailOpen } from 'react-icons/hi'
import {
    apiGetNotificationList,
    apiGetNotificationCount,
} from '@/services/CommonService'
import isLastChild from '@/utils/isLastChild'
import useResponsive from '@/utils/hooks/useResponsive'
import { useRouter } from 'next/navigation'

import type { DropdownRef } from '@/components/ui/Dropdown'

type NotificationList = {
    id: string
    target: string
    description: string
    date: string
    image: string
    type: number
    location: string
    locationLabel: string
    status: string
    readed: boolean
}

const notificationHeight = {
    mobile: 'h-[240px]',
    desktop: 'h-[280px]',
}

const _Notification = ({ className }: { className?: string }) => {
    const [notificationList, setNotificationList] = useState<
        NotificationList[]
    >([])
    const [unreadNotification, setUnreadNotification] = useState(false)
    const [noResult, setNoResult] = useState(false)
    const [loading, setLoading] = useState(false)

    const { larger } = useResponsive()

    const router = useRouter()

    const getNotificationCount = async () => {
        try {
            const resp = await apiGetNotificationCount()
            if (resp.count > 0) {
                setNoResult(false)
                setUnreadNotification(true)
            } else {
                setNoResult(true)
            }
        } catch (error) {
            // Handle authentication errors gracefully
            console.log('📱 Notifications unavailable (user not authenticated)')
            setNoResult(true)
            setUnreadNotification(false)
        }
    }

    useEffect(() => {
        getNotificationCount()
    }, [])

    const onNotificationOpen = async () => {
        if (notificationList.length === 0) {
            setLoading(true)
            try {
                const resp = await apiGetNotificationList()
                setNotificationList(resp)
            } catch (error) {
                console.log(
                    '📱 Failed to load notifications (user not authenticated)',
                )
                setNotificationList([])
            } finally {
                setLoading(false)
            }
        }
    }

    const onMarkAllAsRead = () => {
        const list = notificationList.map((item: NotificationList) => {
            if (!item.readed) {
                item.readed = true
            }
            return item
        })
        setNotificationList(list)
        setUnreadNotification(false)
    }

    const onMarkAsRead = (id: string) => {
        const list = notificationList.map((item) => {
            if (item.id === id) {
                item.readed = true
            }
            return item
        })
        setNotificationList(list)
        const hasUnread = notificationList.some((item) => !item.readed)

        if (!hasUnread) {
            setUnreadNotification(false)
        }
    }

    const notificationDropdownRef = useRef<DropdownRef>(null)

    const handleViewAllActivity = () => {
        router.push('/concepts/account/activity-log')
        if (notificationDropdownRef.current) {
            notificationDropdownRef.current.handleDropdownClose()
        }
    }

    return (
        <Dropdown
            ref={notificationDropdownRef}
            renderTitle={
                <NotificationToggle
                    dot={unreadNotification}
                    className={className}
                />
            }
            menuClass="min-w-[280px] md:min-w-[340px] max-h-[90vh] md:max-h-none"
            placement={larger.md ? 'bottom-end' : 'bottom'}
            onOpen={onNotificationOpen}
        >
            <Dropdown.Item variant="header">
                <div className="dark:border-gray-700 px-2 flex items-center justify-between mb-1">
                    <h6 className="text-sm md:text-base">Notifications</h6>
                    <Tooltip title="Mark all as read">
                        <Button
                            variant="plain"
                            shape="circle"
                            size="sm"
                            icon={
                                <HiOutlineMailOpen className="text-lg md:text-xl" />
                            }
                            onClick={onMarkAllAsRead}
                        />
                    </Tooltip>
                </div>
            </Dropdown.Item>
            <ScrollBar
                className={classNames(
                    'overflow-y-auto',
                    larger.md
                        ? notificationHeight.desktop
                        : notificationHeight.mobile,
                )}
            >
                {notificationList.length > 0 &&
                    notificationList.map((item, index) => (
                        <div key={item.id}>
                            <div
                                className={`relative rounded-xl flex px-3 md:px-4 py-2 md:py-3 cursor-pointer hover:bg-gray-100 active:bg-gray-100 dark:hover:bg-gray-700`}
                                onClick={() => onMarkAsRead(item.id)}
                            >
                                <div>
                                    <NotificationAvatar {...item} />
                                </div>
                                <div className="mx-2 md:mx-3 flex-1">
                                    <div className="text-sm md:text-base">
                                        {item.target && (
                                            <span className="font-semibold heading-text">
                                                {item.target}{' '}
                                            </span>
                                        )}
                                        <span>{item.description}</span>
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {item.date}
                                    </span>
                                </div>
                                <Badge
                                    className="absolute top-3 md:top-4 ltr:right-3 rtl:left-3 md:ltr:right-4 md:rtl:left-4"
                                    innerClass={`${
                                        item.readed
                                            ? 'bg-gray-300 dark:bg-gray-600'
                                            : 'bg-primary'
                                    } `}
                                />
                            </div>
                            {!isLastChild(notificationList, index) ? (
                                <div className="border-b border-gray-200 dark:border-gray-700 my-1 md:my-2" />
                            ) : (
                                ''
                            )}
                        </div>
                    ))}
                {loading && (
                    <div
                        className={classNames(
                            'flex items-center justify-center',
                            larger.md
                                ? notificationHeight.desktop
                                : notificationHeight.mobile,
                        )}
                    >
                        <Spinner size={32} className="md:w-10 md:h-10" />
                    </div>
                )}
                {noResult && notificationList.length === 0 && (
                    <div
                        className={classNames(
                            'flex items-center justify-center',
                            larger.md
                                ? notificationHeight.desktop
                                : notificationHeight.mobile,
                        )}
                    >
                        <div className="text-center px-4">
                            <img
                                className="mx-auto mb-2 max-w-[120px] md:max-w-[150px]"
                                src="/img/others/no-notification.png"
                                alt="no-notification"
                            />
                            <h6 className="font-semibold text-sm md:text-base">
                                No notifications!
                            </h6>
                        </div>
                    </div>
                )}
            </ScrollBar>
            <Dropdown.Item variant="header" className="justify-center">
                <Button
                    variant="plain"
                    className="text-xs md:text-sm"
                    onClick={handleViewAllActivity}
                >
                    View all Activity
                </Button>
            </Dropdown.Item>
        </Dropdown>
    )
}

const Notification = withHeaderItem(_Notification)

export default Notification
