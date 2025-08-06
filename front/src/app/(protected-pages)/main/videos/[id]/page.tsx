'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { ArrowLeft, Home, Video as VideoIcon } from 'lucide-react'
import VideoPlayer from '@/components/shared/VideoPlayer'
import VideoCard from '@/components/shared/VideoCard'
import VideoService, { type Video } from '@/services/VideoService'
import Container from '@/components/shared/Container'

export default function VideoWatchPage() {
    const params = useParams()
    const router = useRouter()
    const videoId = parseInt(params.id as string)

    const [video, setVideo] = useState<Video | null>(null)
    const [relatedVideos, setRelatedVideos] = useState<Video[]>([])
    const [loading, setLoading] = useState(true)
    const [relatedLoading, setRelatedLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const videoService = new VideoService()

    // Load video data
    const loadVideo = async () => {
        if (!videoId || isNaN(videoId)) {
            setError('Неверный ID видео')
            setLoading(false)
            return
        }

        try {
            const videoData = await videoService.getVideo(videoId)
            setVideo(videoData)
        } catch (error) {
            console.error('Failed to load video:', error)
            setError('Не удалось загрузить видео')
        } finally {
            setLoading(false)
        }
    }

    // Load related videos from the same category
    const loadRelatedVideos = async (category: string) => {
        try {
            const response = await videoService.getVideos({
                category: category as 'employment' | 'motion',
                per_page: 8,
            })

            // Filter out current video and limit to 6 related videos
            const filtered = response.videos
                .filter((v) => v.id !== videoId)
                .slice(0, 6)

            setRelatedVideos(filtered)
        } catch (error) {
            console.error('Failed to load related videos:', error)
        } finally {
            setRelatedLoading(false)
        }
    }

    // Load video on mount and when ID changes
    useEffect(() => {
        loadVideo()
    }, [videoId])

    // Load related videos when video is loaded
    useEffect(() => {
        if (video) {
            loadRelatedVideos(video.category)
        }
    }, [video])

    const handleGoBack = () => {
        router.back()
    }

    const handleGoHome = () => {
        router.push('/videos')
    }

    const handleVideoStart = () => {
        // This could be used for analytics or other tracking
        console.log('Video started playing:', video?.title)
    }

    if (loading) {
        return (
            <Container className="py-8">
                <div className="flex justify-center items-center min-h-[400px]">
                    <Spinner size={40} />
                </div>
            </Container>
        )
    }

    if (error || !video) {
        return (
            <Container className="py-8">
                <Card className="p-8 text-center space-y-4">
                    <VideoIcon className="w-16 h-16 mx-auto text-muted-foreground" />
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">
                            {error || 'Видео не найдено'}
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            Возможно, видео было удалено или перемещено
                        </p>
                    </div>
                    <div className="flex justify-center space-x-3">
                        <Button variant="outline" onClick={handleGoBack}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Назад
                        </Button>
                        <Button onClick={handleGoHome}>
                            <Home className="w-4 h-4 mr-2" />
                            Все видео
                        </Button>
                    </div>
                </Card>
            </Container>
        )
    }

    return (
        <Container className="py-8 space-y-8">
            {/* Navigation */}
            <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={handleGoBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Назад
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleGoHome}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <Home className="w-4 h-4 mr-2" />
                    Все видео
                </Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main video player */}
                <div className="xl:col-span-2">
                    <VideoPlayer
                        video={video}
                        onVideoStart={handleVideoStart}
                    />
                </div>

                {/* Related videos sidebar */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-4">
                            Похожие видео
                        </h2>

                        {relatedLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <Spinner size={30} />
                            </div>
                        ) : relatedVideos.length > 0 ? (
                            <div className="space-y-4">
                                {relatedVideos.map((relatedVideo) => (
                                    <VideoCard
                                        key={relatedVideo.id}
                                        video={relatedVideo}
                                        className="hover:shadow-md"
                                        showCategory={false}
                                        showDate={false}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Card className="p-6 text-center">
                                <VideoIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                                <p className="text-muted-foreground">
                                    Нет похожих видео
                                </p>
                            </Card>
                        )}
                    </div>

                    {/* Call to action */}
                    <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                        <div className="text-center space-y-3">
                            <h3 className="font-semibold text-foreground">
                                Больше обучающих видео
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Изучите все наши видеокурсы по трудоустройству и
                                дизайну
                            </p>
                            <Button
                                onClick={handleGoHome}
                                size="sm"
                                className="w-full"
                            >
                                Посмотреть все видео
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </Container>
    )
}
