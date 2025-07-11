'use client'

import { useState, useRef, useEffect } from 'react'
import classNames from '@/utils/classNames'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import ScrollBar from '@/components/ui/ScrollBar'
import navigationIcon from '@/configs/navigation-icon.config'
import {
    GUIDE_PREFIX_PATH,
    UI_COMPONENTS_PREFIX_PATH,
} from '@/constants/route.constant'
import { apiGetSearchResult } from '@/services/CommonService'
import debounce from 'lodash/debounce'
import { HiOutlineSearch, HiChevronRight } from 'react-icons/hi'
import { PiMagnifyingGlassDuotone } from 'react-icons/pi'
import Link from 'next/link'
import Highlighter from 'react-highlight-words'

type SearchData = {
    key: string
    path: string
    title: string
    icon: string
    category: string
    categoryTitle: string
}

type SearchResult = {
    title: string
    data: SearchData[]
}

const recommendedSearch: SearchResult[] = [
    {
        title: 'Recommended',
        data: [
            {
                key: 'guide.documentation',
                path: `${GUIDE_PREFIX_PATH}/documentation/introduction`,
                title: 'Documentation',
                icon: 'documentation',
                category: 'Docs',
                categoryTitle: 'Guide',
            },
            {
                key: 'guide.changeLog',
                path: `${GUIDE_PREFIX_PATH}/changelog`,
                title: 'Changelog',
                icon: 'changeLog',
                category: 'Docs',
                categoryTitle: 'Guide',
            },
            {
                key: 'uiComponent.common.button',
                path: `${UI_COMPONENTS_PREFIX_PATH}/button`,
                title: 'Button',
                icon: 'uiCommonButton',
                category: 'Common',
                categoryTitle: 'UI Components',
            },
        ],
    },
]

const ListItem = (props: {
    icon: string
    label: string
    url: string
    isLast?: boolean
    keyWord: string
    onNavigate: () => void
}) => {
    const { icon, label, url = '', keyWord, onNavigate } = props

    return (
        <Link href={url} onClick={onNavigate}>
            <div
                className={classNames(
                    'flex items-center justify-between rounded-xl p-2 md:p-3 cursor-pointer user-select',
                    'hover:bg-gray-100 dark:hover:bg-gray-700',
                )}
            >
                <div className="flex items-center gap-2">
                    <div
                        className={classNames(
                            'rounded-lg border-2 border-gray-200 shadow-xs text-lg md:text-xl group-hover:shadow-sm h-8 w-8 md:h-10 md:w-10 flex items-center justify-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
                        )}
                    >
                        {icon && navigationIcon[icon]}
                    </div>
                    <div className="text-sm md:text-base text-gray-900 dark:text-gray-300">
                        <Highlighter
                            autoEscape
                            highlightClassName={classNames(
                                'text-primary',
                                'underline bg-transparent font-semibold dark:text-white',
                            )}
                            searchWords={[keyWord]}
                            textToHighlight={label}
                        />
                    </div>
                </div>
                <HiChevronRight className="text-lg" />
            </div>
        </Link>
    )
}

const _Search = ({ className }: { className?: string }) => {
    const [searchDialogOpen, setSearchDialogOpen] = useState(false)
    const [searchResult, setSearchResult] =
        useState<SearchResult[]>(recommendedSearch)
    const [noResult, setNoResult] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)

    const handleReset = () => {
        setNoResult(false)
        setSearchResult(recommendedSearch)
    }

    const handleSearchOpen = () => {
        setSearchDialogOpen(true)
    }

    const handleSearchClose = () => {
        setSearchDialogOpen(false)
        handleReset()
    }

    const debounceFn = debounce(handleDebounceFn, 500)

    async function handleDebounceFn(query: string) {
        if (!query) {
            setSearchResult(recommendedSearch)
            return
        }

        if (noResult) {
            setNoResult(false)
        }

        const respond = await apiGetSearchResult<SearchResult[]>({ query })

        if (respond) {
            if (respond.length === 0) {
                setNoResult(true)
            }
            setSearchResult(respond)
        }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value)
    }

    useEffect(() => {
        if (searchDialogOpen) {
            const timeout = setTimeout(() => inputRef.current?.focus(), 100)
            return () => {
                clearTimeout(timeout)
            }
        }
    }, [searchDialogOpen])

    const handleNavigate = () => {
        handleSearchClose()
    }

    return (
        <>
            <div
                className={classNames(
                    className,
                    'text-xl md:text-2xl cursor-pointer hover:text-primary-500 transition-colors',
                )}
                onClick={handleSearchOpen}
            >
                <PiMagnifyingGlassDuotone />
            </div>
            <Dialog
                contentClassName="p-0 w-[90vw] max-w-[800px] max-h-[90vh]"
                isOpen={searchDialogOpen}
                closable={false}
                onRequestClose={handleSearchClose}
            >
                <div className="flex flex-col h-full">
                    <div className="px-2 md:px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-600">
                        <div className="flex items-center flex-1">
                            <HiOutlineSearch className="text-lg md:text-xl text-gray-400" />
                            <input
                                ref={inputRef}
                                className="ring-0 outline-hidden block w-full py-3 md:py-4 px-2 md:px-4 text-sm md:text-base bg-transparent text-gray-900 dark:text-gray-100"
                                placeholder="Search..."
                                onChange={handleSearch}
                            />
                        </div>
                        <Button
                            size="xs"
                            onClick={handleSearchClose}
                            className="ml-2"
                        >
                            Esc
                        </Button>
                    </div>
                    <ScrollBar className="flex-1 px-2 md:px-4">
                        {noResult ? (
                            <div className="text-center py-10">
                                <div className="text-6xl opacity-30">🔎</div>
                                <h6 className="mt-4 text-sm md:text-base">
                                    No results found!
                                </h6>
                            </div>
                        ) : (
                            <div className="py-4">
                                {searchResult.map((result) => (
                                    <div key={result.title} className="mb-6">
                                        <h6 className="mb-3 text-sm md:text-base px-2 font-semibold">
                                            {result.title}
                                        </h6>
                                        {result.data.map((item) => (
                                            <ListItem
                                                key={item.key}
                                                icon={item.icon}
                                                label={item.title}
                                                url={item.path}
                                                keyWord={
                                                    inputRef.current?.value ||
                                                    ''
                                                }
                                                onNavigate={handleNavigate}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollBar>
                </div>
            </Dialog>
        </>
    )
}

export default withHeaderItem(_Search)
