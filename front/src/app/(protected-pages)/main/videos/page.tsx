'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import Container from '@/components/shared/Container'

interface Video {
    id: number
    title: string
    youtube_video_id: string
    category: string
    is_featured: boolean
}

const hardcodedVideos: Video[] = [
    // Курс по трудоустройству
    {
        id: 1,
        title: 'Как составить резюме',
        youtube_video_id: 'wuUtlAvXOow',
        category: 'employment',
        is_featured: true,
    },
    {
        id: 2,
        title: 'Подготовка к собеседованию',
        youtube_video_id: 'i32vWk2L2BU',
        category: 'employment',
        is_featured: true,
    },
    {
        id: 3,
        title: 'Поиск работы',
        youtube_video_id: 'n85Xbf-9BLw',
        category: 'employment',
        is_featured: false,
    },
    {
        id: 4,
        title: 'Карьерное развитие',
        youtube_video_id: 'SJ19j7euVh0',
        category: 'employment',
        is_featured: false,
    },

    // Motion
    {
        id: 5,
        title: 'Motion Design Basics',
        youtube_video_id: 'sBPlq3Jksww',
        category: 'motion',
        is_featured: true,
    },
    {
        id: 6,
        title: 'After Effects Tutorial',
        youtube_video_id: 'iPr0v_ajhiw',
        category: 'motion',
        is_featured: true,
    },
    {
        id: 7,
        title: 'Animation Principles',
        youtube_video_id: 'iZ5gNjBNMOo',
        category: 'motion',
        is_featured: false,
    },
]

export default function VideosPage() {
    const [activeCategory, setActiveCategory] = useState<
        'all' | 'employment' | 'motion'
    >('all')

    const filteredVideos =
        activeCategory === 'all'
            ? hardcodedVideos
            : hardcodedVideos.filter(
                  (video) => video.category === activeCategory,
              )

    return (
        <Container>
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6">
                    Курстар (Видео уроки)
                </h1>

                {/* Category Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveCategory('all')}
                        className={`px-4 py-2 rounded ${activeCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        Барлығы
                    </button>
                    <button
                        onClick={() => setActiveCategory('employment')}
                        className={`px-4 py-2 rounded ${activeCategory === 'employment' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        Курс по трудоустройству
                    </button>
                    <button
                        onClick={() => setActiveCategory('motion')}
                        className={`px-4 py-2 rounded ${activeCategory === 'motion' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        Motion Design
                    </button>
                </div>

                {/* Videos Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVideos.map((video) => (
                        <Card key={video.id} className="overflow-hidden">
                            <div className="relative">
                                <img
                                    src={`https://img.youtube.com/vi/${video.youtube_video_id}/maxresdefault.jpg`}
                                    alt={video.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                    <button
                                        onClick={() =>
                                            window.open(
                                                `https://www.youtube.com/watch?v=${video.youtube_video_id}`,
                                                '_blank',
                                            )
                                        }
                                        className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full"
                                    >
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-2">
                                    {video.title}
                                </h3>
                                <div className="flex justify-between items-center">
                                    <span
                                        className={`px-2 py-1 text-xs rounded ${
                                            video.category === 'employment'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-purple-100 text-purple-800'
                                        }`}
                                    >
                                        {video.category === 'employment'
                                            ? 'Трудоустройство'
                                            : 'Motion Design'}
                                    </span>
                                    {video.is_featured && (
                                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                                            Рекомендуемое
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </Container>
    )
}
