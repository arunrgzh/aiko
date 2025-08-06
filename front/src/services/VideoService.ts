import ApiService from './ApiService'

export interface Video {
    id: number
    title: string
    description?: string
    youtube_url: string
    youtube_video_id: string
    thumbnail_url?: string
    category: 'employment' | 'motion'
    is_featured: boolean
    views: number
    created_at: string
    updated_at?: string
}

export interface VideosListResponse {
    videos: Video[]
    total: number
    page: number
    per_page: number
    total_pages: number
}

export interface UserVideoHistory {
    id: number
    video_id: number
    watched_at: string
    video: Video
}

export interface UserVideoHistoryResponse {
    history: UserVideoHistory[]
    total: number
}

export interface VideoCreateRequest {
    title: string
    description?: string
    youtube_url: string
    category: 'employment' | 'motion'
    is_featured?: boolean
}

export interface VideoUpdateRequest {
    title?: string
    description?: string
    youtube_url?: string
    category?: 'employment' | 'motion'
    is_featured?: boolean
}

class VideoService {
    /**
     * Get all videos with optional filtering
     */
    async getVideos(params?: {
        category?: 'employment' | 'motion'
        featured_only?: boolean
        page?: number
        per_page?: number
    }): Promise<VideosListResponse> {
        const searchParams = new URLSearchParams()

        if (params?.category) {
            searchParams.append('category', params.category)
        }
        if (params?.featured_only) {
            searchParams.append(
                'featured_only',
                params.featured_only.toString(),
            )
        }
        if (params?.page !== undefined) {
            searchParams.append('page', params.page.toString())
        }
        if (params?.per_page !== undefined) {
            searchParams.append('per_page', params.per_page.toString())
        }

        const queryString = searchParams.toString()
        const url = queryString ? `/api/videos?${queryString}` : '/api/videos'

        console.log('🎥 Fetching videos:', { params, url })

        const response = await ApiService.fetchData<VideosListResponse>({
            url,
            method: 'GET',
        })

        console.log('✅ Videos fetched:', {
            total: response.total,
            count: response.videos.length,
        })

        return response
    }

    /**
     * Get employment videos
     */
    async getEmploymentVideos(params?: {
        page?: number
        per_page?: number
    }): Promise<VideosListResponse> {
        const searchParams = new URLSearchParams()

        if (params?.page !== undefined) {
            searchParams.append('page', params.page.toString())
        }
        if (params?.per_page !== undefined) {
            searchParams.append('per_page', params.per_page.toString())
        }

        const queryString = searchParams.toString()
        const url = queryString
            ? `/api/videos/employment?${queryString}`
            : '/api/videos/employment'

        return await ApiService.fetchData<VideosListResponse>({
            url,
            method: 'GET',
        })
    }

    /**
     * Get motion design videos
     */
    async getMotionVideos(params?: {
        page?: number
        per_page?: number
    }): Promise<VideosListResponse> {
        const searchParams = new URLSearchParams()

        if (params?.page !== undefined) {
            searchParams.append('page', params.page.toString())
        }
        if (params?.per_page !== undefined) {
            searchParams.append('per_page', params.per_page.toString())
        }

        const queryString = searchParams.toString()
        const url = queryString
            ? `/api/videos/motion?${queryString}`
            : '/api/videos/motion'

        return await ApiService.fetchData<VideosListResponse>({
            url,
            method: 'GET',
        })
    }

    /**
     * Get featured videos for dashboard
     */
    async getFeaturedVideos(params?: {
        page?: number
        per_page?: number
    }): Promise<VideosListResponse> {
        const searchParams = new URLSearchParams()

        if (params?.page !== undefined) {
            searchParams.append('page', params.page.toString())
        }
        if (params?.per_page !== undefined) {
            searchParams.append('per_page', params.per_page.toString())
        }

        const queryString = searchParams.toString()
        const url = queryString
            ? `/api/videos/featured?${queryString}`
            : '/api/videos/featured'

        return await ApiService.fetchData<VideosListResponse>({
            url,
            method: 'GET',
        })
    }

    /**
     * Get a specific video by ID
     */
    async getVideo(videoId: number): Promise<Video> {
        console.log('🎥 Fetching video:', videoId)

        const response = await ApiService.fetchData<Video>({
            url: `/api/videos/${videoId}`,
            method: 'GET',
        })

        console.log('✅ Video fetched:', response.title)
        return response
    }

    /**
     * Track that a user viewed a video
     */
    async trackVideoView(videoId: number): Promise<{ message: string }> {
        console.log('👁️ Tracking video view:', videoId)

        const response = await ApiService.fetchData<{ message: string }>({
            url: `/api/videos/${videoId}/view`,
            method: 'POST',
        })

        console.log('✅ Video view tracked:', response.message)
        return response
    }

    /**
     * Get user's video watch history
     */
    async getUserVideoHistory(params?: {
        page?: number
        per_page?: number
    }): Promise<UserVideoHistoryResponse> {
        const searchParams = new URLSearchParams()

        if (params?.page !== undefined) {
            searchParams.append('page', params.page.toString())
        }
        if (params?.per_page !== undefined) {
            searchParams.append('per_page', params.per_page.toString())
        }

        const queryString = searchParams.toString()
        const url = queryString
            ? `/api/videos/user/history?${queryString}`
            : '/api/videos/user/history'

        return await ApiService.fetchData<UserVideoHistoryResponse>({
            url,
            method: 'GET',
        })
    }

    // Admin functions
    /**
     * Create a new video (admin only)
     */
    async createVideo(videoData: VideoCreateRequest): Promise<Video> {
        console.log('➕ Creating video:', videoData.title)

        const response = await ApiService.fetchData<Video>({
            url: '/api/videos/admin/videos',
            method: 'POST',
            data: videoData,
        })

        console.log('✅ Video created:', response.title)
        return response
    }

    /**
     * Update a video (admin only)
     */
    async updateVideo(
        videoId: number,
        videoData: VideoUpdateRequest,
    ): Promise<Video> {
        console.log('✏️ Updating video:', videoId)

        const response = await ApiService.fetchData<Video>({
            url: `/api/videos/admin/videos/${videoId}`,
            method: 'PUT',
            data: videoData,
        })

        console.log('✅ Video updated:', response.title)
        return response
    }

    /**
     * Delete a video (admin only)
     */
    async deleteVideo(videoId: number): Promise<{ message: string }> {
        console.log('🗑️ Deleting video:', videoId)

        const response = await ApiService.fetchData<{ message: string }>({
            url: `/api/videos/admin/videos/${videoId}`,
            method: 'DELETE',
        })

        console.log('✅ Video deleted:', response.message)
        return response
    }

    // Utility functions
    /**
     * Extract YouTube video ID from URL
     */
    static extractVideoId(url: string): string | null {
        const patterns = [
            /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
            /(?:youtu\.be\/)([^&\n?#]+)/,
            /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
            /(?:youtube\.com\/v\/)([^&\n?#]+)/,
        ]

        for (const pattern of patterns) {
            const match = url.match(pattern)
            if (match) {
                return match[1]
            }
        }
        return null
    }

    /**
     * Get YouTube thumbnail URL
     */
    static getThumbnailUrl(
        videoId: string,
        quality: string = 'maxresdefault',
    ): string {
        return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`
    }

    /**
     * Get YouTube embed URL
     */
    static getEmbedUrl(videoId: string): string {
        return `https://www.youtube.com/embed/${videoId}`
    }

    /**
     * Get YouTube watch URL
     */
    static getWatchUrl(videoId: string): string {
        return `https://www.youtube.com/watch?v=${videoId}`
    }
}

export default VideoService
