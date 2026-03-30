import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Post, PostDocument } from '@app/models/posts/post.schema'
import { User, UserDocument } from '@app/models/users/user.schema'
import { AnalyticsResponseDto } from '../dto/analytics.dto'
import { LikeParentType } from '@app/models/likes/like.schema'

@Injectable()
export class AnalyticsService {
    constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

    private readonly RECENT_DAYS = 7
    private readonly MAX_TOP_POSTERS = 5

    async getMyStats(user: UserDocument): Promise<AnalyticsResponseDto> {
        const recentDaysAgo = new Date()
        recentDaysAgo.setDate(recentDaysAgo.getDate() - this.RECENT_DAYS)

        const [userStats, topPosters] = await Promise.all([this.getUserStats(user._id, recentDaysAgo), this.getTopPosters()])

        //on extrait les data
        const all = userStats[0].allPosts[0] ?? { totalPosts: 0, totalLikes: 0 }
        const recent = userStats[0].recentPosts[0] ?? { recentPosts: 0, recentLikes: 0 }

        //On récupère les infos qui nous interessent des top posters
        const topPostersData = topPosters.map((p) => ({
            username: p.username,
            postCount: p.postCount,
        }))

        return {
            totalPosts: all.totalPosts,
            totalLikes: all.totalLikes,
            recentPosts: recent.recentPosts,
            recentLikes: recent.recentLikes,
            topPosters: topPostersData,
            recentLimitDays: this.RECENT_DAYS,
        }
    }

    /**
     * Recupère les différentes stats sur les posts du user
     * @param userId
     * @param limitDate
     * @returns
     */
    private getUserStats(userId: Types.ObjectId, limitDate: Date) {
        return this.postModel.aggregate([
            { $match: { author: userId } },

            // Joint la collection Like sur chaque post
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'parentId',
                    pipeline: [{ $match: { parentType: LikeParentType.POST } }],
                    as: 'likes',
                },
            },

            // Calcule tous les stats en une seule passe
            {
                $facet: {
                    allPosts: [
                        {
                            $group: {
                                _id: null,
                                totalPosts: { $sum: 1 },
                                totalLikes: { $sum: { $size: '$likes' } },
                            },
                        },
                    ],
                    recentPosts: [
                        { $match: { createdAt: { $gte: limitDate } } },
                        {
                            $group: {
                                _id: null,
                                recentPosts: { $sum: 1 },
                                recentLikes: { $sum: { $size: '$likes' } },
                            },
                        },
                    ],
                },
            },
        ])
    }

    /**
     * Retourne le personnes qui post le plus
     */
    private getTopPosters() {
        return this.postModel.aggregate([
            { $group: { _id: '$author', postCount: { $sum: 1 } } },
            { $sort: { postCount: -1 } },
            { $limit: this.MAX_TOP_POSTERS },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $unwind: '$user' },
            { $project: { username: '$user.username', postCount: 1 } },
        ])
    }
}
