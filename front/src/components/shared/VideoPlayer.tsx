'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Eye, Calendar, ExternalLink, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { format } from 'date-fns'
import type { Video } from '@/services/VideoService'
import VideoService from '@/services/VideoService'

interface VideoPlayerProps {
    video: Video
    autoplay?: boolean
    className?: string
    onVideoStart?: () => void
}

const VideoPlayer = ({
    video,
    autoplay = false,
    className = '',
    onVideoStart,
}: VideoPlayerProps) => {
    const [isLoading, setIsLoading] = useState(true)
    const [hasTrackedView, setHasTrackedView] = useState(false)

    const embedUrl = VideoService.getEmbedUrl(video.youtube_video_id)
    const watchUrl = VideoService.getWatchUrl(video.youtube_video_id)

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
                return 'Курс по трудоустройству'
            case 'motion':
                return 'Motion Design'
            default:
                return category
        }
    }

    const handleIframeLoad = () => {
        setIsLoading(false)
        if (onVideoStart) {
            onVideoStart()
        }
    }

    const trackVideoView = async () => {
        if (!hasTrackedView) {
            try {
                await VideoService.prototype.trackVideoView(video.id)
                setHasTrackedView(true)
            } catch (error) {
                console.error('Failed to track video view:', error)
            }
        }
    }

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/videos/${video.id}`

        if (navigator.share) {
            try {
                await navigator.share({
                    title: video.title,
                    text: video.description || 'Посмотрите это обучающее видео',
                    url: shareUrl,
                })
            } catch (error) {
                console.log('Share cancelled')
            }
        } else {
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(shareUrl)
                // You could show a toast here
                console.log('Link copied to clipboard')
            } catch (error) {
                console.error('Failed to copy link:', error)
            }
        }
    }

    // Track view when component mounts
    useEffect(() => {
        trackVideoView()
    }, [video.id])

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Video Player */}
            <Card className="overflow-hidden">
                <div className="relative aspect-video bg-black">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    )}

                    <iframe
                        src={`${embedUrl}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1`}
                        title={video.title}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        onLoad={handleIframeLoad}
                    />
                </div>
            </Card>

            {/* Video Info */}
            <div className="space-y-4">
                {/* Title and badges */}
                <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                        <Badge className={getCategoryColor(video.category)}>
                            {getCategoryLabel(video.category)}
                        </Badge>

                        {video.is_featured && (
                            <Badge className="bg-yellow-500 text-white">
                                Рекомендуем
                            </Badge>
                        )}
                    </div>

                    <h1 className="text-2xl font-bold text-foreground">
                        {video.title}
                    </h1>
                </div>

                {/* Metadata and actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{video.views} просмотров</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                                {format(
                                    new Date(video.created_at),
                                    'dd MMMM yyyy',
                                    { locale: require('date-fns/locale/ru') },
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(watchUrl, '_blank')}
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Открыть на YouTube
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleShare}
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            Поделиться
                        </Button>
                    </div>
                </div>

                {/* Description */}
                {video.description && (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p className="text-muted-foreground leading-relaxed">
                            {video.description}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VideoPlayer
