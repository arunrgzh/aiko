'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import Dialog from '@/components/ui/Dialog'
import Select, { Option } from '@/components/ui/Select'
import Switcher from '@/components/ui/Switcher'
import { FormItem } from '@/components/ui/Form'
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    ExternalLink,
    Save,
    X,
    Video as VideoIcon,
    AlertCircle,
} from 'lucide-react'
import VideoService, {
    type Video,
    type VideoCreateRequest,
    type VideoUpdateRequest,
} from '@/services/VideoService'
import Container from '@/components/shared/Container'
import { format } from 'date-fns'
import Image from 'next/image'

interface VideoFormData {
    title: string
    description: string
    youtube_url: string
    category: 'employment' | 'motion'
    is_featured: boolean
}

const initialFormData: VideoFormData = {
    title: '',
    description: '',
    youtube_url: '',
    category: 'employment',
    is_featured: false,
}

export default function AdminVideosPage() {
    const [videos, setVideos] = useState<Video[]>([])
    const [loading, setLoading] = useState(true)
    const [formLoading, setFormLoading] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingVideo, setEditingVideo] = useState<Video | null>(null)
    const [formData, setFormData] = useState<VideoFormData>(initialFormData)
    const [formErrors, setFormErrors] = useState<Partial<VideoFormData>>({})
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

    const videoService = new VideoService()

    // Load videos
    const loadVideos = async () => {
        try {
            setLoading(true)
            const response = await videoService.getVideos({ per_page: 100 })
            setVideos(response.videos)
        } catch (error) {
            console.error('Failed to load videos:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadVideos()
    }, [])

    // Form validation
    const validateForm = (): boolean => {
        const errors: Partial<VideoFormData> = {}

        if (!formData.title.trim()) {
            errors.title = 'Название обязательно'
        }

        if (!formData.youtube_url.trim()) {
            errors.youtube_url = 'URL YouTube обязателен'
        } else {
            const videoId = VideoService.extractVideoId(formData.youtube_url)
            if (!videoId) {
                errors.youtube_url = 'Неверный URL YouTube'
            }
        }

        if (!formData.category) {
            errors.category = 'Категория обязательна'
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return

        try {
            setFormLoading(true)

            if (editingVideo) {
                // Update existing video
                const updateData: VideoUpdateRequest = {
                    title: formData.title,
                    description: formData.description || undefined,
                    youtube_url: formData.youtube_url,
                    category: formData.category,
                    is_featured: formData.is_featured,
                }

                await videoService.updateVideo(editingVideo.id, updateData)
            } else {
                // Create new video
                const createData: VideoCreateRequest = {
                    title: formData.title,
                    description: formData.description || undefined,
                    youtube_url: formData.youtube_url,
                    category: formData.category,
                    is_featured: formData.is_featured,
                }

                await videoService.createVideo(createData)
            }

            // Reset form and reload videos
            setFormData(initialFormData)
            setEditingVideo(null)
            setDialogOpen(false)
            await loadVideos()
        } catch (error) {
            console.error('Failed to save video:', error)
        } finally {
            setFormLoading(false)
        }
    }

    // Handle edit
    const handleEdit = (video: Video) => {
        setEditingVideo(video)
        setFormData({
            title: video.title,
            description: video.description || '',
            youtube_url: video.youtube_url,
            category: video.category,
            is_featured: video.is_featured,
        })
        setFormErrors({})
        setDialogOpen(true)
    }

    // Handle delete
    const handleDelete = async (videoId: number) => {
        try {
            await videoService.deleteVideo(videoId)
            await loadVideos()
            setDeleteConfirm(null)
        } catch (error) {
            console.error('Failed to delete video:', error)
        }
    }

    // Handle new video
    const handleNew = () => {
        setEditingVideo(null)
        setFormData(initialFormData)
        setFormErrors({})
        setDialogOpen(true)
    }

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'employment':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            case 'motion':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }
    }

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'employment':
                return 'Трудоустройство'
            case 'motion':
                return 'Motion Design'
            default:
                return category
        }
    }

    return (
        <Container className="py-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
                        <VideoIcon className="w-8 h-8 text-primary" />
                        <span>Управление видео</span>
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Добавляйте, редактируйте и управляйте обучающими видео
                    </p>
                </div>

                <Button onClick={handleNew}>
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить видео
                </Button>
            </div>

            {/* Videos list */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <Spinner size={40} />
                </div>
            ) : videos.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {videos.map((video) => (
                        <Card key={video.id} className="overflow-hidden">
                            <div className="flex">
                                {/* Thumbnail */}
                                <div className="relative w-32 h-24 flex-shrink-0">
                                    {video.thumbnail_url ? (
                                        <Image
                                            src={video.thumbnail_url}
                                            alt={video.title}
                                            fill
                                            className="object-cover"
                                            sizes="128px"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                            <VideoIcon className="w-8 h-8 text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <h3 className="font-semibold text-sm line-clamp-2">
                                            {video.title}
                                        </h3>

                                        <div className="flex space-x-1">
                                            {video.is_featured && (
                                                <Badge className="bg-yellow-500 text-white text-xs">
                                                    Топ
                                                </Badge>
                                            )}
                                            <Badge
                                                className={`${getCategoryColor(video.category)} text-xs`}
                                            >
                                                {getCategoryLabel(
                                                    video.category,
                                                )}
                                            </Badge>
                                        </div>
                                    </div>

                                    {video.description && (
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {video.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center space-x-1">
                                                <Eye className="w-3 h-3" />
                                                <span>{video.views}</span>
                                            </div>
                                            <span>
                                                {format(
                                                    new Date(video.created_at),
                                                    'dd.MM.yyyy',
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex space-x-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    window.open(
                                                        video.youtube_url,
                                                        '_blank',
                                                    )
                                                }
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleEdit(video)
                                                }
                                            >
                                                <Edit className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    setDeleteConfirm(video.id)
                                                }
                                            >
                                                <Trash2 className="w-3 h-3 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="p-12 text-center">
                    <VideoIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        Нет видео
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        Добавьте первое обучающее видео
                    </p>
                    <Button onClick={handleNew}>
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить видео
                    </Button>
                </Card>
            )}

            {/* Add/Edit Video Dialog */}
            <Dialog
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                title={editingVideo ? 'Редактировать видео' : 'Добавить видео'}
                className="max-w-md"
            >
                <div className="space-y-4">
                    {/* Title */}
                    <FormItem
                        label="Название *"
                        invalid={!!formErrors.title}
                        errorMessage={formErrors.title}
                    >
                        <Input
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }
                            placeholder="Введите название видео"
                            invalid={!!formErrors.title}
                        />
                    </FormItem>

                    {/* Description */}
                    <FormItem label="Описание">
                        <Input
                            asElement="textarea"
                            rows={3}
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            placeholder="Введите описание видео"
                        />
                    </FormItem>

                    {/* YouTube URL */}
                    <FormItem
                        label="YouTube URL *"
                        invalid={!!formErrors.youtube_url}
                        errorMessage={formErrors.youtube_url}
                    >
                        <Input
                            value={formData.youtube_url}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    youtube_url: e.target.value,
                                })
                            }
                            placeholder="https://www.youtube.com/watch?v=..."
                            invalid={!!formErrors.youtube_url}
                        />
                    </FormItem>

                    {/* Category */}
                    <FormItem
                        label="Категория *"
                        invalid={!!formErrors.category}
                        errorMessage={formErrors.category}
                    >
                        <Select
                            value={formData.category}
                            onChange={(value: 'employment' | 'motion') =>
                                setFormData({ ...formData, category: value })
                            }
                            placeholder="Выберите категорию"
                        >
                            <Option value="employment">Трудоустройство</Option>
                            <Option value="motion">Motion Design</Option>
                        </Select>
                    </FormItem>

                    {/* Featured */}
                    <FormItem label="Рекомендуемое видео">
                        <div className="flex items-center space-x-2">
                            <Switcher
                                checked={formData.is_featured}
                                onChange={(checked) =>
                                    setFormData({
                                        ...formData,
                                        is_featured: checked,
                                    })
                                }
                            />
                            <span className="text-sm">
                                Показать в рекомендуемых
                            </span>
                        </div>
                    </FormItem>

                    {/* Actions */}
                    <div className="flex space-x-3 pt-4">
                        <Button
                            onClick={handleSubmit}
                            disabled={formLoading}
                            className="flex-1"
                        >
                            {formLoading ? (
                                <Spinner size={16} className="mr-2" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            {editingVideo ? 'Сохранить' : 'Создать'}
                        </Button>
                        <Button
                            variant="default"
                            onClick={() => setDialogOpen(false)}
                            disabled={formLoading}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Отмена
                        </Button>
                    </div>
                </div>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                isOpen={deleteConfirm !== null}
                onClose={() => setDeleteConfirm(null)}
                title={
                    <div className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span>Подтвердите удаление</span>
                    </div>
                }
                className="max-w-md"
            >
                <div className="space-y-4">
                    <p>
                        Вы уверены, что хотите удалить это видео? Это действие
                        нельзя отменить.
                    </p>

                    <div className="flex space-x-3">
                        <Button
                            variant="solid"
                            color="red"
                            onClick={() =>
                                deleteConfirm && handleDelete(deleteConfirm)
                            }
                            className="flex-1"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Удалить
                        </Button>
                        <Button
                            variant="default"
                            onClick={() => setDeleteConfirm(null)}
                            className="flex-1"
                        >
                            Отмена
                        </Button>
                    </div>
                </div>
            </Dialog>
        </Container>
    )
}
