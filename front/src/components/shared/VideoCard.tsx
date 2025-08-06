'use client'

import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PlayCircle, Eye, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import type { Video } from '@/services/VideoService'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface VideoCardProps {
    video: Video
    className?: string
    showCategory?: boolean
    showViews?: boolean
    showDate?: boolean
}

const VideoCard = ({
    video,
    className = '',
    showCategory = true,
    showViews = true,
    showDate = true,
}: VideoCardProps) => {
    const router = useRouter()

    const handleCardClick = () => {
        router.push(`/videos/${video.id}`)
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
        <Card
            className={`group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${className}`}
            onClick={handleCardClick}
        >
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
                {video.thumbnail_url ? (
                    <Image
                        src={video.thumbnail_url}
                        alt={video.title}
                        fill
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <PlayCircle className="w-12 h-12 text-gray-400" />
                    </div>
                )}

                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 text-white drop-shadow-lg" />
                </div>

                {/* Featured badge */}
                {video.is_featured && (
                    <div className="absolute top-2 left-2">
                        <Badge className="bg-yellow-500 text-white">
                            Рекомендуем
                        </Badge>
                    </div>
                )}

                {/* Category badge */}
                {showCategory && (
                    <div className="absolute top-2 right-2">
                        <Badge className={getCategoryColor(video.category)}>
                            {getCategoryLabel(video.category)}
                        </Badge>
                    </div>
                )}
            </div>

            <div className="p-4 space-y-3">
                {/* Title */}
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {video.title}
                </h3>

                {/* Description */}
                {video.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {video.description}
                    </p>
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-4">
                        {showViews && (
                            <div className="flex items-center space-x-1">
                                <Eye className="w-3 h-3" />
                                <span>{video.views} просмотров</span>
                            </div>
                        )}

                        {showDate && (
                            <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>
                                    {format(
                                        new Date(video.created_at),
                                        'dd.MM.yyyy',
                                    )}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default VideoCard
