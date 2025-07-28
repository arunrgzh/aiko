'use client'

import { Fragment, useState } from 'react'
import { useTranslations } from 'next-intl'
import ScrollBar from '@/components/ui/ScrollBar'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import ChatHistoryItem from './ChatHistoryItem'
import { useGenerativeChatStore } from '../_store/generativeChatStore'
import { TbChevronDown, TbChevronUp, TbTrash } from 'react-icons/tb'

type ChatHistoryProps = {
    queryText?: string
    onClick?: () => void
}

const INITIAL_DISPLAY_COUNT = 3

const ChatHistory = ({ queryText = '', onClick }: ChatHistoryProps) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false)
    const t = useTranslations('aiChat')

    const {
        chatHistory,
        setChatHistory,
        setRenameDialog,
        setSelectedConversation,
        selectedConversation,
        clearAllChatHistory,
    } = useGenerativeChatStore()

    const handleDelete = (id: string) => {
        setChatHistory(chatHistory.filter((item) => item.id !== id))
        setSelectedConversation('')
    }

    const handleArchive = (id: string) => {
        setChatHistory(chatHistory.filter((item) => item.id !== id))
        setSelectedConversation('')
    }

    const handleRename = (id: string, title: string) => {
        setRenameDialog({
            id,
            title,
            open: true,
        })
    }

    const handleClick = (id: string) => {
        setSelectedConversation(id)
        onClick?.()
    }

    const handleDeleteAll = () => {
        clearAllChatHistory()
        setShowDeleteAllDialog(false)
    }

    const filteredChatHistory = chatHistory.filter(
        (item) =>
            item.title.toLowerCase().includes(queryText.toLowerCase()) &&
            item.enable,
    )

    const displayedChatHistory =
        isExpanded || queryText
            ? filteredChatHistory
            : filteredChatHistory.slice(0, INITIAL_DISPLAY_COUNT)

    const hasMoreItems = filteredChatHistory.length > INITIAL_DISPLAY_COUNT
    const showExpandButton = hasMoreItems && !queryText

    return (
        <>
            <ScrollBar className="h-full">
                <div className="flex flex-col gap-2 py-2 px-3">
                    {/* Delete All Button */}
                    {chatHistory.length > 0 && (
                        <div className="flex justify-end mb-2">
                            <Button
                                size="xs"
                                variant="plain"
                                icon={<TbTrash />}
                                onClick={() => setShowDeleteAllDialog(true)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                {t('history.deleteAll')}
                            </Button>
                        </div>
                    )}

                    {/* Chat History Items */}
                    {displayedChatHistory.map((item) => (
                        <ChatHistoryItem
                            key={item.id}
                            data-testid={item.id}
                            title={item.title}
                            conversation={item.lastConversation}
                            active={selectedConversation === item.id}
                            onDelete={() => handleDelete(item.id)}
                            onArchive={() => handleArchive(item.id)}
                            onRename={() => handleRename(item.id, item.title)}
                            onClick={() => handleClick(item.id)}
                        />
                    ))}

                    {/* Expand/Collapse Button */}
                    {showExpandButton && (
                        <Button
                            size="sm"
                            variant="plain"
                            className="mt-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            <div className="flex items-center gap-2">
                                {isExpanded ? (
                                    <>
                                        <TbChevronUp className="text-lg" />
                                        <span>{t('history.showLess')}</span>
                                    </>
                                ) : (
                                    <>
                                        <TbChevronDown className="text-lg" />
                                        <span>
                                            {t('history.showMore', {
                                                count:
                                                    filteredChatHistory.length -
                                                    INITIAL_DISPLAY_COUNT,
                                            })}
                                        </span>
                                    </>
                                )}
                            </div>
                        </Button>
                    )}

                    {/* Empty State */}
                    {filteredChatHistory.length === 0 && queryText && (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                            {t('history.noChatsFound', { query: queryText })}
                        </div>
                    )}
                </div>
            </ScrollBar>

            {/* Delete All Confirmation Dialog */}
            <Dialog
                isOpen={showDeleteAllDialog}
                onClose={() => setShowDeleteAllDialog(false)}
                onRequestClose={() => setShowDeleteAllDialog(false)}
            >
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {t('history.deleteAllTitle')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {t('history.deleteAllMessage')}
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="plain"
                            onClick={() => setShowDeleteAllDialog(false)}
                        >
                            {t('feedback.cancel')}
                        </Button>
                        <Button
                            variant="solid"
                            color="red-600"
                            onClick={handleDeleteAll}
                        >
                            {t('history.deleteAll')}
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default ChatHistory
