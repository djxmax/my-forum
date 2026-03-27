export class TopPosterDto {
    username: string
    postCount: number
}

export class AnalyticsResponseDto {
    totalPosts: number
    recentPosts: number
    totalLikes: number
    recentLikes: number
    topPosters: TopPosterDto[]
    recentLimitDays: number
}
