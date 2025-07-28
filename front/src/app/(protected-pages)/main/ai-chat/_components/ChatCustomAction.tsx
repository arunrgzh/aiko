'use client'

import { useRef, useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { Form, FormItem } from '@/components/ui/Form'
import Dialog from '@/components/ui/Dialog'
import Tooltip from '@/components/ui/Tooltip'
import classNames from '@/utils/classNames'
import {
    TbThumbUp,
    TbThumbUpFilled,
    TbThumbDown,
    TbThumbDownFilled,
    TbCopy,
    TbCheck,
} from 'react-icons/tb'

type ChatCustomActionProps = {
    content: string
}

const ChatCustomAction = ({ content }: ChatCustomActionProps) => {
    const detailInput = useRef<HTMLTextAreaElement>(null)
    const [copied, setCopied] = useState(false)
    const [selected, setSelected] = useState('')
    const [responseSend, setResponSend] = useState('')
    const [responseDialog, setResponseDialog] = useState<{
        type: string
        open: boolean
    }>({
        type: '',
        open: false,
    })
    const t = useTranslations('aiChat')

    const responseOption = [
        {
            label: t('feedback.options.notFactuallyCorrect'),
            value: 'notFactuallyCorrect',
        },
        {
            label: t('feedback.options.harmfulContent'),
            value: 'harmfulContent',
        },
        {
            label: t('feedback.options.overeactiveRefusal'),
            value: 'overeactiveRefusal',
        },
        { label: t('feedback.options.other'), value: 'other' },
    ]

    const btnClass =
        'p-2 rounded-full hover:bg-black  hover:bg-opacity-5 hover:text-gray-900 dark:hover:bg-black dark:hover:text-gray-100 dark:hover:bg-opacity-40 transition-colors duration-300 ease-in-out'

    useEffect(() => {
        if (copied && content) {
            navigator.clipboard.writeText(content)
            if (copied) {
                const copyFeedbackInterval = setTimeout(
                    () => setCopied(false),
                    2000,
                )

                return () => {
                    clearTimeout(copyFeedbackInterval)
                }
            }
        }
    }, [copied, content])

    const handleDialogClose = () => {
        setResponseDialog({
            type: '',
            open: false,
        })
    }

    const handleSubmit = () => {
        setResponSend(responseDialog.type)
        handleDialogClose()
        toast.push(
            <Notification type="success">
                {t('feedback.thankYou')}
            </Notification>,
            { placement: 'top-center' },
        )
    }

    return (
        <>
            <div className="flex mt-0.5">
                <Tooltip
                    title={copied ? t('actions.copied') : t('actions.copy')}
                    placement="bottom"
                >
                    <button
                        className={classNames(btnClass, 'text-lg')}
                        onClick={() => setCopied(true)}
                    >
                        {copied ? (
                            <TbCheck className="text-emerald-500" />
                        ) : (
                            <TbCopy />
                        )}
                    </button>
                </Tooltip>
                <Tooltip title={t('actions.goodResponse')} placement="bottom">
                    <button
                        className={classNames(btnClass, 'text-lg')}
                        onClick={() =>
                            setResponseDialog({ type: 'praise', open: true })
                        }
                    >
                        {responseSend === 'praise' ? (
                            <TbThumbUpFilled />
                        ) : (
                            <TbThumbUp />
                        )}
                    </button>
                </Tooltip>
                <Tooltip title={t('actions.badResponse')} placement="bottom">
                    <button
                        className={classNames(btnClass, 'text-lg')}
                        onClick={() =>
                            setResponseDialog({ type: 'blame', open: true })
                        }
                    >
                        {responseSend === 'blame' ? (
                            <TbThumbDownFilled />
                        ) : (
                            <TbThumbDown />
                        )}
                    </button>
                </Tooltip>
            </div>
            <Dialog
                isOpen={responseDialog.open}
                onClose={handleDialogClose}
                onRequestClose={handleDialogClose}
            >
                <h5 className="mb-4">{t('feedback.title')}</h5>
                <Form onSubmit={handleSubmit}>
                    {responseDialog.type === 'praise' && (
                        <FormItem label={t('feedback.praiseLabel')}>
                            <Input
                                ref={detailInput}
                                textArea
                                placeholder={t('feedback.praisePlaceholder')}
                            />
                        </FormItem>
                    )}
                    {responseDialog.type === 'blame' && (
                        <>
                            <FormItem label={t('feedback.blameLabel')}>
                                <Select
                                    instanceId="response-option"
                                    options={responseOption}
                                    value={responseOption.filter(
                                        (response) =>
                                            response.value === selected,
                                    )}
                                    onChange={(option) =>
                                        setSelected(option?.value || '')
                                    }
                                />
                            </FormItem>
                            <FormItem label={t('feedback.praiseLabel')}>
                                <Input
                                    ref={detailInput}
                                    textArea
                                    placeholder={t('feedback.blamePlaceholder')}
                                />
                            </FormItem>
                        </>
                    )}
                </Form>
                <div className="flex justify-end gap-2">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        type="button"
                        onClick={handleDialogClose}
                    >
                        {t('feedback.cancel')}
                    </Button>
                    <Button
                        variant="solid"
                        type="submit"
                        onClick={handleSubmit}
                    >
                        {t('feedback.submit')}
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default ChatCustomAction
