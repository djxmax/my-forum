import { Comment, CommentSchema } from '@app/models/comments/comment.schema'
import { Like, LikeSchema } from '@app/models/likes/like.schema'
import { Post, PostSchema } from '@app/models/posts/post.schema'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { LikeController } from '../controllers/like.controller'
import { LikeService } from '../services/like.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Like.name, schema: LikeSchema },
            { name: Post.name, schema: PostSchema },
            { name: Comment.name, schema: CommentSchema },
        ]),
    ],
    controllers: [LikeController],
    providers: [LikeService],
    exports: [LikeService],
})
export class LikeModule {}
