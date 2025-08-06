'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
    ChevronLeft,
    ChevronRight,
    PlayCircle,
    Eye,
    ExternalLink,
} from 'lucide-react'
import type { Video } from '@/services/VideoService'
import VideoService from '@/services/VideoService'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface VideoCarouselProps {
    videos: Video[]
    title?: string
    className?: string
    showCategory?: boolean
    autoSlide?: boolean
    slideInterval?: number
}

const VideoCarousel = ({
    videos,
    title = 'Рекомендуемые видео',
    className = '',
    showCategory = true,
    autoSlide = false,
    slideInterval = 5000,
}: VideoCarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const carouselRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === videos.length - 1 ? 0 : prevIndex + 1,
        )
    }

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? videos.length - 1 : prevIndex - 1,
        )
    }

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
    }

    const handleVideoClick = (video: Video) => {
        router.push(`/videos/${video.id}`)
    }

    const handleWatchOnYouTube = (video: Video, e: React.MouseEvent) => {
        e.stopPropagation()
        const watchUrl = VideoService.getWatchUrl(video.youtube_video_id)
        window.open(watchUrl, '_blank')
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

    // Auto-slide functionality
    useEffect(() => {
        if (autoSlide && !isHovered && videos.length > 1) {
            const interval = setInterval(nextSlide, slideInterval)
            return () => clearInterval(interval)
        }
    }, [autoSlide, isHovered, videos.length, slideInterval])

    if (videos.length === 0) {
        return null
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {title && (
                <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            )}

            <div
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Main carousel */}
                <div
                    ref={carouselRef}
                    className="relative overflow-hidden rounded-lg"
                >
                    <div
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{
                            transform: `translateX(-${currentIndex * 100}%)`,
                        }}
                    >
                        {videos.map((video, index) => (
                            <div
                                key={video.id}
                                className="w-full flex-shrink-0"
                            >
                                <Card
                                    className="group cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-lg"
                                    onClick={() => handleVideoClick(video)}
                                >
                                    <div className="flex flex-col lg:flex-row">
                                        {/* Video thumbnail */}
                                        <div className="relative lg:w-1/2 aspect-video lg:aspect-auto">
                                            {video.thumbnail_url ? (
                                                <Image
                                                    src={video.thumbnail_url}
                                                    alt={video.title}
                                                    fill
                                                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                                                    sizes="(max-width: 1024px) 100vw, 50vw"
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

                                            {/* Badges */}
                                            <div className="absolute top-4 left-4 flex flex-col space-y-2">
                                                {video.is_featured && (
                                                    <Badge className="bg-yellow-500 text-white">
                                                        Рекомендуем
                                                    </Badge>
                                                )}

                                                {showCategory && (
                                                    <Badge
                                                        className={getCategoryColor(
                                                            video.category,
                                                        )}
                                                    >
                                                        {getCategoryLabel(
                                                            video.category,
                                                        )}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Video info */}
                                        <div className="lg:w-1/2 p-6 flex flex-col justify-center space-y-4">
                                            <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                                                {video.title}
                                            </h3>

                                            {video.description && (
                                                <p className="text-muted-foreground line-clamp-3">
                                                    {video.description}
                                                </p>
                                            )}

                                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                <div className="flex items-center space-x-1">
                                                    <Eye className="w-4 h-4" />
                                                    <span>
                                                        {video.views} просмотров
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex space-x-3">
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleVideoClick(video)
                                                    }
                                                >
                                                    <PlayCircle className="w-4 h-4 mr-2" />
                                                    Смотреть
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={(e) =>
                                                        handleWatchOnYouTube(
                                                            video,
                                                            e,
                                                        )
                                                    }
                                                >
                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                    YouTube
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation arrows */}
                {videos.length > 1 && (
                    <>
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800"
                            onClick={prevSlide}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800"
                            onClick={nextSlide}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </>
                )}

                {/* Dots indicator */}
                {videos.length > 1 && (
                    <div className="flex justify-center space-x-2 mt-4">
                        {videos.map((_, index) => (
                            <button
                                key={index}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                    index === currentIndex
                                        ? 'bg-primary'
                                        : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                                onClick={() => goToSlide(index)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default VideoCarousel
