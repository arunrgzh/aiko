'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Video, Play, ArrowRight, Eye, BookOpen } from 'lucide-react'
import VideoService, { type Video as VideoType } from '@/services/VideoService'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface VideoWidgetProps {
    title?: string
    maxVideos?: number
    showCategory?: 'all' | 'employment' | 'motion' | 'featured'
    className?: string
}

const VideoWidget = ({
    title = 'Рекомендуемые видео',
    maxVideos = 3,
    showCategory = 'featured',
    className = '',
}: VideoWidgetProps) => {
    const [videos, setVideos] = useState<VideoType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const videoService = new VideoService()

    useEffect(() => {
        const loadVideos = async () => {
            try {
                setLoading(true)
                let response

                switch (showCategory) {
                    case 'employment':
                        response = await videoService.getEmploymentVideos({
                            per_page: maxVideos,
                        })
                        break
                    case 'motion':
                        response = await videoService.getMotionVideos({
                            per_page: maxVideos,
                        })
                        break
                    case 'featured':
                        response = await videoService.getFeaturedVideos({
                            per_page: maxVideos,
                        })
                        break
                    default:
                        response = await videoService.getVideos({
                            per_page: maxVideos,
                        })
                        break
                }

                setVideos(response.videos)
            } catch (err) {
                console.error('Failed to load videos:', err)
                setError('Не удалось загрузить видео')
            } finally {
                setLoading(false)
            }
        }

        loadVideos()
    }, [showCategory, maxVideos])

    const handleVideoClick = (video: VideoType) => {
        router.push(`/videos/${video.id}`)
    }

    const handleViewAll = () => {
        router.push('/videos')
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
                return 'Motion'
            default:
                return category
        }
    }

    if (loading) {
        return (
            <Card className={`p-6 ${className}`}>
                <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-9 w-24" />
                </div>
                <div className="space-y-4">
                    {Array.from({ length: maxVideos }).map((_, index) => (
                        <div key={index} className="flex space-x-4">
                            <Skeleton className="w-24 h-16 rounded-md flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        )
    }

    if (error || videos.length === 0) {
        return (
            <Card className={`p-6 ${className}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center space-x-2">
                        <Video className="w-5 h-5 text-primary" />
                        <span>{title}</span>
                    </h3>
                </div>

                <div className="text-center py-8 space-y-3">
                    <BookOpen className="w-12 h-12 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">
                        {error || 'Нет доступных видео'}
                    </p>
                    <Button variant="outline" size="sm" onClick={handleViewAll}>
                        Посмотреть все видео
                    </Button>
                </div>
            </Card>
        )
    }

    return (
        <Card className={`p-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Video className="w-5 h-5 text-primary" />
                    <span>{title}</span>
                </h3>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleViewAll}
                    className="text-primary hover:text-primary/80"
                >
                    Все видео
                    <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
            </div>

            {/* Video list */}
            <div className="space-y-4">
                {videos.map((video, index) => (
                    <div
                        key={video.id}
                        className="group flex space-x-4 cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-colors"
                        onClick={() => handleVideoClick(video)}
                    >
                        {/* Thumbnail */}
                        <div className="relative w-24 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                            {video.thumbnail_url ? (
                                <Image
                                    src={video.thumbnail_url}
                                    alt={video.title}
                                    fill
                                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                                    sizes="96px"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Play className="w-6 h-6 text-muted-foreground" />
                                </div>
                            )}

                            {/* Play overlay */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                <Play className="w-6 h-6 text-white drop-shadow-lg" />
                            </div>

                            {/* Video number */}
                            <div className="absolute top-1 left-1">
                                <Badge
                                    variant="secondary"
                                    className="text-xs px-1.5 py-0.5"
                                >
                                    {index + 1}
                                </Badge>
                            </div>
                        </div>

                        {/* Video info */}
                        <div className="flex-1 min-w-0 space-y-1">
                            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                {video.title}
                            </h4>

                            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                    <Eye className="w-3 h-3" />
                                    <span>{video.views}</span>
                                </div>

                                <Badge
                                    className={`${getCategoryColor(video.category)} text-xs px-1.5 py-0.5`}
                                >
                                    {getCategoryLabel(video.category)}
                                </Badge>
                            </div>

                            {video.description && (
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                    {video.description}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-border">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleViewAll}
                    className="w-full"
                >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Посмотреть все обучающие видео
                </Button>
            </div>
        </Card>
    )
}

export default VideoWidget
