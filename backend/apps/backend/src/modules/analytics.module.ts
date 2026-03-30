import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AnalyticsController } from '../controllers/analytics.controller'
import { AnalyticsService } from '../services//analytics.service'
import { Post, PostSchema } from '@app/models/posts/post.schema'
import { AuthModule } from '@app/auth'
import { Like, LikeSchema } from '@app/models/likes/like.schema'

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([
            { name: Post.name, schema: PostSchema },
            { name: Like.name, schema: LikeSchema },
        ]),
    ],
    controllers: [AnalyticsController],
    providers: [AnalyticsService],
})
export class AnalyticsModule {}
