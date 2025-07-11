'use client'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { clearTokenCache } from '@/services/axios/AxiosRequestInterceptorConfigCallback'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import { PiUserDuotone, PiGearDuotone, PiSignOutDuotone } from 'react-icons/pi'
import classNames from '@/utils/classNames'

import type { JSX } from 'react'

type DropdownList = {
    label: string
    path: string
    icon: JSX.Element
}

const dropdownItemList: DropdownList[] = [
    // Settings removed as per navigation update
]

const _UserDropdown = ({ className }: { className?: string }) => {
    const { session } = useCurrentSession()

    const handleSignOut = async () => {
        // Clear the token cache before signing out
        clearTokenCache()
        await signOut({ callbackUrl: '/sign-in' })
    }

    const avatarProps = {
        icon: <PiUserDuotone />,
    }

    return (
        <Dropdown
            className={classNames('flex', className)}
            toggleClassName="flex items-center"
            renderTitle={
                <div className="cursor-pointer flex items-center">
                    <Avatar
                        size={28}
                        className="md:w-8 md:h-8"
                        {...avatarProps}
                    />
                </div>
            }
            placement="bottom-end"
            menuClass="min-w-[240px] md:min-w-[280px]"
        >
            <Dropdown.Item variant="header">
                <div className="py-2 px-3 flex items-center gap-2 md:gap-3">
                    <Avatar
                        className="w-8 h-8 md:w-10 md:h-10"
                        {...avatarProps}
                    />
                    <div>
                        <div className="font-bold text-sm md:text-base text-gray-900 dark:text-gray-100">
                            {session?.user?.name || 'Anonymous'}
                        </div>
                        <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                            {session?.user?.email || 'No email available'}
                        </div>
                    </div>
                </div>
            </Dropdown.Item>
            <Dropdown.Item variant="divider" />
            {dropdownItemList.map((item) => (
                <Dropdown.Item
                    key={item.label}
                    eventKey={item.label}
                    className="px-0"
                >
                    <Link
                        className="flex h-full w-full px-2 py-2 text-sm md:text-base hover:bg-gray-50 dark:hover:bg-gray-700"
                        href={item.path}
                    >
                        <span className="flex gap-2 items-center w-full">
                            <span className="text-lg md:text-xl opacity-70">
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </span>
                    </Link>
                </Dropdown.Item>
            ))}
            <Dropdown.Item variant="divider" />
            <Dropdown.Item
                eventKey="Sign Out"
                className="gap-2 py-2 text-sm md:text-base hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={handleSignOut}
            >
                <span className="text-lg md:text-xl opacity-70">
                    <PiSignOutDuotone />
                </span>
                <span>Sign Out</span>
            </Dropdown.Item>
        </Dropdown>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown
